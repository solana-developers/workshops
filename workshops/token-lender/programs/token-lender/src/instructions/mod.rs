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
use anchor_lang::system_program;
use anchor_spl::token;
use std::str::FromStr;

use crate::state::LoanEscrow;

pub trait ToPubkey {
    fn to_pubkey(&self) -> Pubkey;
}

impl ToPubkey for &str {
    fn to_pubkey(&self) -> Pubkey {
        Pubkey::from_str(&self).expect("Error parsing public key from string.")
    }
}

fn burn_signed<'a>(
    token_program: AccountInfo<'a>,
    mint: AccountInfo<'a>,
    from: AccountInfo<'a>,
    authority: AccountInfo<'a>,
    loan_id: u8,
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
                LoanEscrow::SEED_PREFIX.as_bytes().as_ref(),
                loan_id.to_le_bytes().as_ref(),
                &[loan_escrow_bump],
            ]],
        ),
        amount,
    )
}

fn transfer_sol<'a>(
    system_program: AccountInfo<'a>,
    from: AccountInfo<'a>,
    to: AccountInfo<'a>,
    amount: u64,
) -> Result<()> {
    system_program::transfer(
        CpiContext::new(system_program, system_program::Transfer { from, to }),
        amount,
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
    loan_id: u8,
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
                LoanEscrow::SEED_PREFIX.as_bytes().as_ref(),
                loan_id.to_le_bytes().as_ref(),
                &[loan_escrow_bump],
            ]],
        ),
        loan_amount,
    )
}
