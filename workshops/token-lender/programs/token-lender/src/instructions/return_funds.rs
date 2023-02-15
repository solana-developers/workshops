/**
 * Returns USDC to the loan escrow.
 */

use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::state::LoanEscrow;
use crate::util::{ Seeds, ToPubkey };
use crate::USDC_MINT;

use super::transfer_token;

pub fn return_funds(
    ctx: Context<ReturnFunds>,
    _loan_id: u32,
    amount: u64,
) -> Result<()> {

    // Make sure the amount transferred isn't more than the loan amount
    assert!(deposit_does_not_overflow(
        &ctx.accounts.loan_escrow,
        &ctx.accounts.loan_escrow_usdc_ata,
        amount,
    ));

    // Transfer USDC from the borrower back to the loan escrow
    transfer_token(
        ctx.accounts.token_program.to_account_info(), 
        ctx.accounts.borrower.to_account_info(), 
        ctx.accounts.borrower_usdc_ata.to_account_info(), 
        ctx.accounts.loan_escrow_usdc_ata.to_account_info(), 
        amount,
    )?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(
    loan_id: u32,
    amount: u64,
)]
pub struct ReturnFunds<'info> {

    #[account(
        mint::decimals = 6,
        address = USDC_MINT.to_pubkey(),
    )]
    pub usdc_mint: Account<'info, token::Mint>,

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
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = borrower,
    )]
    pub borrower_usdc_ata: Account<'info, token::TokenAccount>,

    pub token_program: Program<'info, token::Token>,
}

fn deposit_does_not_overflow<'a, 'b>(
    loan_escrow: &'b Account<'a, LoanEscrow>,
    loan_escrow_usdc_ata: &'b Account<'a, token::TokenAccount>,
    transfer_amount: u64,
) -> bool {
    transfer_amount <= loan_escrow.deposit - loan_escrow_usdc_ata.amount
}