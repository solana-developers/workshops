use anchor_lang::prelude::*;

use crate::state::Escrow;

pub fn return_funds(
    ctx: Context<ReturnFunds>,
    _blockhash: u64,
) -> Result<()> {
    
    // this should assert that the ctx.accounts.loan_escrow borrower and lender keys match their token accounts, 
    //      return ctx.deposit to the lender, and make the pda return the collateral in the loan_escrow.


    msg!("hi");
    Ok(())
}

#[derive(Accounts)]
#[instruction(blockhash: u64)]
pub struct ReturnFunds<'info> {
    #[account(
        mut,
        address = loan_escrow.borrower.unwrap()
    )]
    pub borrower: Signer<'info>,
    #[account(
        mut,
        address = loan_escrow.lender
    )]
    pub lender: Signer<'info>,
    #[account(
        mut,
        seeds = [
            b"loan_escrow",
            blockhash.to_le_bytes().as_ref(),
        ],
        bump = loan_escrow.bump,
    )]
    pub loan_escrow: Account<'info, Escrow>,
    pub system_program: Program<'info, System>,
}