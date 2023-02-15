/**
 * Accepts an available loan by depositing a calculated amount
 *      of SOL collateral into the escrow.
 */

use anchor_lang::prelude::*;
use anchor_lang::solana_program::{
    entrypoint::ProgramResult,
    native_token::LAMPORTS_PER_SOL,
    program::invoke,
};
use anchor_spl::{associated_token, token};
use mpl_token_metadata::instruction as mpl_instruction;
use pyth_sdk_solana::load_price_feed_from_account_info;

use crate::{ SOL_USD_PRICE_FEED_ID, USDC_MINT };
use crate::error::ErrorCode;
use crate::state::LoanEscrow;
use crate::util::{ Seeds, ToPubkey };

use super::{ transfer_sol, transfer_token_signed };

pub fn accept_loan(
    ctx: Context<AcceptLoan>,
    loan_id: u32,
) -> Result<()> {

    // Get SOL/USDC price conversion data
    let sol_usd_price_feed = load_price_feed_from_account_info(&ctx.accounts.pyth_account).unwrap();
    let current_price = sol_usd_price_feed.get_price_unchecked();

    // Calculate the required collateral
    let amount_in_lamports = ctx.accounts.loan_escrow.deposit
        * LAMPORTS_PER_SOL
        * 10u64.pow(u32::try_from(-current_price.expo).unwrap())
        / (u64::try_from(current_price.price).unwrap());

    let loan_escrow_bump = *ctx.bumps.get(LoanEscrow::SEED_PREFIX).unwrap();

    // Take the borrower's SOL as collateral
    transfer_sol(
        ctx.accounts.borrower.to_account_info(),
        ctx.accounts.loan_escrow.to_account_info(),
        amount_in_lamports,
    )?;

    // Create metadata for this loan's receipt token
    create_receipt_token_metadata(
        ctx.accounts.token_metadata_program.to_account_info(),
        ctx.accounts.loan_note_mint_metadata.to_account_info(),
        ctx.accounts.loan_note_mint.to_account_info(),
        ctx.accounts.loan_escrow.to_account_info(),
        ctx.accounts.borrower.to_account_info(),
        ctx.accounts.rent.to_account_info(),
    )?;

    // Mint receipt tokens to the lender
    mint_receipt_tokens_to_lender(
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.loan_note_mint.to_account_info(),
        ctx.accounts.lender_loan_note_mint_ata.to_account_info(),
        ctx.accounts.loan_escrow.to_account_info(),
        loan_id,
        loan_escrow_bump,
        ctx.accounts.loan_escrow.deposit,
    )?;

    // Transfer the USDC loan out to the borrower
    transfer_token_signed(
        ctx.accounts.token_program.to_account_info(), 
        ctx.accounts.loan_escrow.to_account_info(), 
        ctx.accounts.loan_escrow_usdc_ata.to_account_info(), 
        ctx.accounts.borrower_usdc_ata.to_account_info(), 
        loan_id, 
        loan_escrow_bump, 
        ctx.accounts.loan_escrow.deposit,
    )?;
    
    ctx.accounts.loan_escrow.borrower = Some(ctx.accounts.borrower.key());

    Ok(())
}

#[derive(Accounts)]
#[instruction(loan_id: u32)]
pub struct AcceptLoan<'info> {

    #[account(
        mint::decimals = 6,
        address = USDC_MINT.to_pubkey(),
    )]
    pub usdc_mint: Account<'info, token::Mint>,
    
    #[account(
        init,
        payer = borrower,
        mint::decimals = 6,
        mint::authority = loan_escrow,
    )]
    pub loan_note_mint: Account<'info, token::Mint>,
    /// CHECK: Metaplex will check this
    #[account(mut)]
    pub loan_note_mint_metadata: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [
            &LoanEscrow::SEED_PREFIX.to_seed(),
            &loan_id.to_seed(),
        ],
        bump = loan_escrow.bump,
    )]
    pub loan_escrow: Account<'info, LoanEscrow>,
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = loan_escrow,
    )]
    pub loan_escrow_usdc_ata: Account<'info, token::TokenAccount>,

    #[account(mut)]
    pub borrower: Signer<'info>,
    #[account(
        init_if_needed,
        payer = borrower,
        associated_token::mint = usdc_mint,
        associated_token::authority = borrower,
    )]
    pub borrower_usdc_ata: Account<'info, token::TokenAccount>,
    
    #[account(
        mut,
        address = loan_escrow.lender,
    )]
    pub lender: SystemAccount<'info>,
    #[account(
        init_if_needed,
        payer = borrower,
        associated_token::mint = loan_note_mint,
        associated_token::authority = lender,
    )]
    pub lender_loan_note_mint_ata: Account<'info, token::TokenAccount>,
    
    /// CHECK: Pyth will check this
    #[account(
        address = SOL_USD_PRICE_FEED_ID.to_pubkey()
            @ ErrorCode::InvalidArgument
    )]
    pub pyth_account: AccountInfo<'info>,

    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    /// CHECK: Metaplex will check this
    pub token_metadata_program: UncheckedAccount<'info>,
}

fn create_receipt_token_metadata<'a>(
    token_metadata_program: AccountInfo<'a>,
    loan_note_mint_metadata: AccountInfo<'a>,
    loan_note_mint: AccountInfo<'a>,
    loan_escrow: AccountInfo<'a>,
    borrower: AccountInfo<'a>,
    rent: AccountInfo<'a>,
) -> ProgramResult {
    invoke(
        &mpl_instruction::create_metadata_accounts_v3(
            *token_metadata_program.key,
            *loan_note_mint_metadata.key,
            *loan_note_mint.key,
            *loan_escrow.key,
            *borrower.key,
            *loan_escrow.key,
            String::from("Loan Note Token"),
            String::from("RCPT"),
            String::from("https://arweave.net/7kC-rLS5FmAtYhfjvFGPT0ZXOHCum4okc08hY2mE12w"),
            None,
            0,
            true,
            false,
            None,
            None,
            None,
        ),
        &[
            loan_note_mint_metadata,
            loan_note_mint,
            loan_escrow,
            borrower,
            rent,
        ],
    )
}

fn mint_receipt_tokens_to_lender<'a>(
    token_program: AccountInfo<'a>,
    loan_note_mint: AccountInfo<'a>,
    lender_loan_note_mint_ata: AccountInfo<'a>,
    loan_escrow: AccountInfo<'a>,
    loan_id: u32,
    loan_escrow_bump: u8,
    deposit: u64,
) -> Result<()> {
    token::mint_to(
        CpiContext::new_with_signer(
            token_program,
            token::MintTo {
                mint: loan_note_mint,
                to: lender_loan_note_mint_ata,
                authority: loan_escrow,
            },
            &[&[
                &LoanEscrow::SEED_PREFIX.to_seed(),
                &loan_id.to_seed(),
                &[loan_escrow_bump]
            ]],
        ),
        deposit,
    )
}
