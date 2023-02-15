mod error;
mod instructions;
mod state;

use anchor_lang::prelude::*;

use instructions::*;

declare_id!("D8uy8ZP5i994D1mCvs61DUJLFa51RK45YMPrcoNrB4E2");

const SOL_USD_PRICE_FEED_ID: &str = "J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix";
const USDC_MINT: &str = "Awy3qcokrpKMH7ustbAnfibhSehVtnmWhAFiVrimV157";

#[program]
mod token_lender {
    use super::*;

    pub fn create_loan(
        ctx: Context<CreateLoan>,
        loan_id: u8,
        deposit_usdc: u64,
        expiry_timestamp: u64,
    ) -> Result<()> {
        create_loan::create_loan(ctx, loan_id, deposit_usdc, expiry_timestamp)
    }

    pub fn accept_loan(
        ctx: Context<AcceptLoan>,
        loan_id: u8,
    ) -> Result<()> {
        accept_loan::accept_loan(ctx, loan_id)
    }

    pub fn return_funds(
        ctx: Context<ReturnFunds>,
        loan_id: u8,
        amount: u64,
    ) -> Result<()> {
        return_funds::return_funds(ctx, loan_id, amount)
    }

    pub fn close_expired(
        ctx: Context<CloseExpired>,
        loan_id: u8,
    ) -> Result<()> {
        close_expired::close_expired(ctx, loan_id)
    }

    pub fn close_returned(
        ctx: Context<CloseReturned>,
        loan_id: u8,
    ) -> Result<()> {
        close_returned::close_returned(ctx, loan_id)
    }
}
