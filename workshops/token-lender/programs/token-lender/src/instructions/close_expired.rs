/**
 * Liquidates all SOL collateral & any USDC from the escrow to the lender
 *      if the loan has expired.
 */

use anchor_lang::{prelude::*, AccountsClose};
use anchor_spl::{ associated_token, token };

use crate::USDC_MINT;
use crate::state::LoanEscrow;

use super::{ ToPubkey, burn_signed, transfer_token };

pub fn close_expired(
    ctx: Context<CloseExpired>,
    loan_id: u8,
) -> Result<()> {

    let loan_escrow_bump = *ctx.bumps.get(LoanEscrow::SEED_PREFIX).unwrap();

    // Check to make sure the loan is expired
    assert!(loan_is_expired(
        &ctx.accounts.clock,
        &ctx.accounts.loan_escrow,
    ));

    // Collect receipt tokens from the lender
    transfer_token(
        ctx.accounts.token_program.to_account_info(), 
        ctx.accounts.lender.to_account_info(), 
        ctx.accounts.lender_loan_note_mint_ata.to_account_info(), 
        ctx.accounts.loan_escrow.to_account_info(), 
        ctx.accounts.loan_escrow.deposit,
    )?;

    // Burn the receipt token
    burn_signed(
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.loan_note_mint.to_account_info(),
        ctx.accounts.loan_escrow_loan_note_mint_ata.to_account_info(),
        ctx.accounts.loan_escrow.to_account_info(),
        loan_id,
        loan_escrow_bump,
        ctx.accounts.loan_escrow.deposit,
    )?;

    // Return any USDC in the loan escrow
    transfer_token(
        ctx.accounts.token_program.to_account_info(), 
        ctx.accounts.loan_escrow.to_account_info(), 
        ctx.accounts.loan_escrow_usdc_ata.to_account_info(), 
        ctx.accounts.lender_usdc_ata.to_account_info(), 
        ctx.accounts.loan_escrow.deposit,
    )?;

    // Close the loan & liquidate the collateral to the lender
    ctx.accounts.loan_escrow.close(ctx.accounts.lender.to_account_info())?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(
    loan_id: u8
)]
pub struct CloseExpired<'info> {

    #[account(
        mint::decimals = 6,
        address = USDC_MINT.to_pubkey(),
    )]
    pub usdc_mint: Account<'info, token::Mint>,

    #[account(
        mut,
        mint::decimals = 6,
        mint::authority = loan_escrow,
    )]
    pub loan_note_mint: Account<'info, token::Mint>,

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
    pub loan_escrow_loan_note_mint_ata: Account<'info, token::TokenAccount>,

    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = loan_escrow,
    )]
    pub loan_escrow_usdc_ata: Account<'info, token::TokenAccount>,

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
    pub lender_loan_note_mint_ata: Account<'info, token::TokenAccount>,
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = loan_escrow,
    )]
    pub lender_usdc_ata: Account<'info, token::TokenAccount>,

    pub clock: Sysvar<'info, Clock>,

    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
}

fn loan_is_expired<'a>(
    clock: &Sysvar<'a, Clock>,
    loan_escrow: &Account<'a, LoanEscrow>,
) -> bool {
    clock.slot > loan_escrow.expiry_timestamp
}