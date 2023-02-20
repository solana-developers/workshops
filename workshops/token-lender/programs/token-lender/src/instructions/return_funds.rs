/**
 * Returns USDC to the loan escrow.
 */
use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::state::LoanEscrow;
use crate::USDC_MINT;

use super::{transfer_token, ToPubkey};

pub fn return_funds(ctx: Context<ReturnFunds>, _loan_id: u8, amount: u64) -> Result<()> {
    msg!("Make sure the amount transferred isn't more than the loan amount");
    assert!(deposit_does_not_overflow(
        &ctx.accounts.loan_escrow,
        &ctx.accounts.loan_escrow_usdc_ata,
        amount,
    ));

    msg!("Transfer USDC from the borrower back to the loan escrow");
    transfer_token(
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.borrower.to_account_info(),
        ctx.accounts.borrower_usdc_ata.to_account_info(),
        ctx.accounts.loan_escrow_usdc_ata.to_account_info(),
        amount,
    )?;

    msg!("Return the borrower's SOL collateral");
    return_lamports(
        ctx.accounts.loan_escrow.to_account_info(),
        ctx.accounts.borrower.to_account_info(),
    )?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(
    loan_id: u8,
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
            LoanEscrow::SEED_PREFIX.as_bytes().as_ref(),
            loan_id.to_le_bytes().as_ref(),
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

    #[account(
        mut,
        address = loan_escrow.borrower
    )]
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

fn return_lamports<'a>(loan_escrow: AccountInfo<'a>, borrower: AccountInfo<'a>) -> Result<()> {
    // Calculate the required rent for the loan escrow account
    let account_span = loan_escrow.try_data_len()?;
    let lamports_required = (Rent::get()?).minimum_balance(account_span);

    // Take the total lamports in the loan escrow account minus the required rent
    let return_lamports = loan_escrow.lamports() - lamports_required;

    // Return that amount to the borrower
    loan_escrow
        .try_borrow_mut_lamports()?
        .checked_sub(return_lamports)
        .unwrap();
    borrower
        .try_borrow_mut_lamports()?
        .checked_add(return_lamports)
        .unwrap();

    Ok(())
}
