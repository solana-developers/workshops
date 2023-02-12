use anchor_lang::prelude::*;

use crate::state::Escrow;

pub fn close_expired(
    ctx: Context<CloseExpired>,
    _blockhash: u64,
) -> Result<()> {
    // this should assert that ctx.accounts.loan_escrow lender is the signer and that the current unix.timestamp is bigger than the ctx.accounts.loan_escrow.expiry_timestamp
    msg!("hi");
    Ok(())
}

#[derive(Accounts)]
#[instruction(blockhash: u64)]
pub struct CloseExpired<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [
            b"loan_escrow",
            blockhash.to_le_bytes().as_ref(),
        ],
        bump = loan_escrow.bump,
    )]
    pub loan_escrow: Account<'info, Escrow>,
}