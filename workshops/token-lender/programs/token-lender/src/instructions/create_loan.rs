use anchor_lang::prelude::*;

use crate::state::Escrow;

pub fn create_loan(
    ctx: Context<CreateLoan>,
    _blockhash: u64,
    deposit_usdc: u64,
    expiry_timestamp: i64,
) -> Result<()> {

    ctx.accounts.loan_escrow.set_inner(
        Escrow {
            borrower: None,
            lender: ctx.accounts.signer.key(),
            deposit: deposit_usdc,
            bump: *ctx.bumps.get("loan_escrow").unwrap(),
            expiry_timestamp: expiry_timestamp,
            initialized: false,
        }
    );
    Ok(())
}

#[derive(Accounts)]
#[instruction(
    blockhash: u64,
    deposit_usdc: u64,
    expiry_timestamp: i64,
)]
pub struct CreateLoan<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init, 
        payer = signer, 
        space = 8 + 8, 
        seeds = [
            b"loan_escrow",
            blockhash.to_le_bytes().as_ref(),
        ],
        bump
    )]
    pub loan_escrow: Account<'info, Escrow>,
    pub system_program: Program<'info, System>,
}