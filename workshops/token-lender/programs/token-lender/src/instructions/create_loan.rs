/**
 * Creates a new loan by depositing the amount of USDC to lend into
 *      the escrow account.
 */

use anchor_lang::prelude::*;
use anchor_spl::{ associated_token, token };
 
use crate::USDC_MINT;
use crate::state::LoanEscrow;

use super::{ ToPubkey, transfer_token };

pub fn create_loan(
    ctx: Context<CreateLoan>,
    loan_id: u8,
    deposit: u64,
    expiry_timestamp: u64,
) -> Result<()> {

    // Set up the data for the new loan
    ctx.accounts.loan_escrow.set_inner(
        LoanEscrow {
            lender: ctx.accounts.lender.key(),
            borrower: None,
            deposit,
            expiry_timestamp,
            loan_id,
            bump: *ctx.bumps.get(LoanEscrow::SEED_PREFIX).unwrap(),
        }
    );

    // Fund the loan with USDC
    transfer_token(
        ctx.accounts.token_program.to_account_info(), 
        ctx.accounts.lender.to_account_info(), 
        ctx.accounts.lender_usdc_ata.to_account_info(), 
        ctx.accounts.loan_escrow_usdc_ata.to_account_info(), 
        deposit,
    )?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(
    loan_id: u8
)]
pub struct CreateLoan<'info> {
    
    #[account(
        mint::decimals = 6,
        address = USDC_MINT.to_pubkey(),
    )]
    pub usdc_mint: Account<'info, token::Mint>,

    #[account(
        init,
        payer = lender,
        space = 8 + 32 + 1 + 32 + 8 + 8 + 1,
        seeds = [
            LoanEscrow::SEED_PREFIX.as_bytes().as_ref(),
            loan_id.to_le_bytes().as_ref(),
        ],
        bump,
    )]
    pub loan_escrow: Account<'info, LoanEscrow>,
    #[account(
        init,
        payer = lender,
        associated_token::mint = usdc_mint,
        associated_token::authority = loan_escrow,
    )]
    pub loan_escrow_usdc_ata: Account<'info, token::TokenAccount>,

    #[account(mut)]
    pub lender: Signer<'info>,
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = lender,
    )]
    pub lender_usdc_ata: Account<'info, token::TokenAccount>,

    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
}