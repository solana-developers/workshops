pub mod accept_loan;
pub mod close_expired;
pub mod close_returned;
pub mod create_loan;
pub mod return_funds;

pub use accept_loan::*;
pub use close_expired::*;
pub use close_returned::*;
pub use create_loan::*;
pub use return_funds::*;

use anchor_lang::prelude::*;
use anchor_lang::solana_program::{
    entrypoint::ProgramResult,
    program::invoke,
    system_instruction,
};
use anchor_spl::token;

use crate::state::LoanEscrow;
use crate::util::Seeds;

fn burn_signed<'a>(
    token_program: AccountInfo<'a>,
    mint: AccountInfo<'a>,
    from: AccountInfo<'a>,
    authority: AccountInfo<'a>,
    loan_id: u32,
    loan_escrow_bump: u8,
    amount: u64,
) -> Result<()> {
    token::burn(
        CpiContext::new_with_signer(
            token_program,
            token::Burn {
                mint,
                from,
                authority,
            },
            &[&[
                &LoanEscrow::SEED_PREFIX.to_seed(),
                &loan_id.to_seed(),
                &[loan_escrow_bump]
            ]],
        ),
        amount,
    )
}

fn transfer_sol<'a>(
    from: AccountInfo<'a>,
    to: AccountInfo<'a>,
    amount: u64,
) -> ProgramResult {
    invoke(
        &system_instruction::transfer(
            &from.key,
            &to.key,
            amount,
        ),
        &[
            from,
            to,
        ],
    )
}

fn transfer_token<'a>(
    token_program: AccountInfo<'a>,
    authority: AccountInfo<'a>,
    from: AccountInfo<'a>,
    to: AccountInfo<'a>,
    amount: u64,
) -> Result<()> {
    token::transfer(
        CpiContext::new(
            token_program,
            token::Transfer {
                from,
                to,
                authority,
            },
        ),
        amount,
    )
}

fn transfer_token_signed<'a>(
    token_program: AccountInfo<'a>,
    loan_escrow: AccountInfo<'a>,
    from: AccountInfo<'a>,
    to: AccountInfo<'a>,
    loan_id: u32,
    loan_escrow_bump: u8,
    loan_amount: u64,
) -> Result<()> {
    token::transfer(
        CpiContext::new_with_signer(
            token_program,
            token::Transfer {
                from,
                to,
                authority: loan_escrow,
            },
            &[&[
                &LoanEscrow::SEED_PREFIX.to_seed(),
                &loan_id.to_seed(),
                &[loan_escrow_bump]
            ]],
        ),
        loan_amount,
    )
}