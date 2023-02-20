/**
 * Liquidates all SOL collateral to the borrower and returns
 *      the USDC principle.
 */
use anchor_lang::{prelude::*, AccountsClose};
use anchor_spl::{associated_token, token};

use crate::state::LoanEscrow;
use crate::USDC_MINT;

use super::{burn_signed, transfer_token, transfer_token_signed, ToPubkey};

pub fn close_returned(ctx: Context<CloseReturned>, loan_id: u8) -> Result<()> {
    let loan_escrow_bump = ctx.accounts.loan_escrow.bump;

    msg!("Check to make sure the loan has been returned");
    assert!(loan_is_paid(
        &ctx.accounts.loan_escrow,
        &ctx.accounts.loan_escrow_usdc_ata,
    ));

    msg!("Collect receipt tokens from the lender");
    transfer_token(
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.lender.to_account_info(),
        ctx.accounts.lender_loan_note_mint_ata.to_account_info(),
        ctx.accounts
            .loan_escrow_loan_note_mint_ata
            .to_account_info(),
        ctx.accounts.loan_escrow.deposit,
    )?;

    msg!("Return the USDC loan to the lender");
    transfer_token_signed(
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.loan_escrow.to_account_info(),
        ctx.accounts.loan_escrow_usdc_ata.to_account_info(),
        ctx.accounts.lender_usdc_ata.to_account_info(),
        loan_id,
        ctx.accounts.loan_escrow.bump,
        ctx.accounts.loan_escrow_usdc_ata.amount,
    )?;

    msg!("Burn the receipt token");
    burn_signed(
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.loan_note_mint.to_account_info(),
        ctx.accounts
            .loan_escrow_loan_note_mint_ata
            .to_account_info(),
        ctx.accounts.loan_escrow.to_account_info(),
        loan_id,
        loan_escrow_bump,
        ctx.accounts.loan_escrow.deposit,
    )?;

    ctx.accounts
        .loan_escrow
        .close(ctx.accounts.lender.to_account_info())?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(loan_id: u8)]
pub struct CloseReturned<'info> {
    #[account(
        mint::decimals = 6,
        address = USDC_MINT.to_pubkey(),
    )]
    pub usdc_mint: Box<Account<'info, token::Mint>>,

    #[account(
        mut,
        mint::decimals = 6,
        mint::authority = loan_escrow,
    )]
    pub loan_note_mint: Box<Account<'info, token::Mint>>,

    #[account(
        mut,
        seeds = [
            LoanEscrow::SEED_PREFIX.as_bytes().as_ref(),
            loan_id.to_le_bytes().as_ref(),
        ],
        bump = loan_escrow.bump,
    )]
    pub loan_escrow: Account<'info, LoanEscrow>,
    #[account(
        init_if_needed,
        payer = lender,
        associated_token::mint = loan_note_mint,
        associated_token::authority = loan_escrow,
    )]
    pub loan_escrow_loan_note_mint_ata: Box<Account<'info, token::TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = loan_escrow,
    )]
    pub loan_escrow_usdc_ata: Box<Account<'info, token::TokenAccount>>,

    #[account(
        mut,
        address = loan_escrow.lender,
    )]
    pub lender: Signer<'info>,
    #[account(
        mut,
        associated_token::mint = loan_note_mint,
        associated_token::authority = lender,
    )]
    pub lender_loan_note_mint_ata: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = lender,
    )]
    pub lender_usdc_ata: Box<Account<'info, token::TokenAccount>>,

    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
}

fn loan_is_paid<'a, 'b>(
    loan_escrow: &'b Account<'a, LoanEscrow>,
    loan_escrow_usdc_ata: &'b Account<'a, token::TokenAccount>,
) -> bool {
    loan_escrow_usdc_ata.amount >= loan_escrow.deposit
}
