mod error;
mod instructions;
mod state;

use std::str::FromStr;

use anchor_lang::prelude::*;

use instructions::*;

declare_id!("AKZrnqcbiagoFUUTvrPSGh4qChKSu6JMubasWUzUPHmD");

const SOL_USD_PRICE_FEED_ID: &str = "J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix";
const USDC_MINT: &str = "J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix";

#[program]
mod hello_anchor {
    use super::*;

    pub fn create_loan(
        ctx: Context<CreateLoan>,
        blockhash: u64,
        deposit_usdc: u64,
        expiry_timestamp: i64,
    ) -> Result<()> {
        create_loan::create_loan(ctx, blockhash, deposit_usdc, expiry_timestamp)
    }

    pub fn accept_loan(
        ctx: Context<AcceptLoan>,
        blockhash: u64,
    ) -> Result<()> {
        accept_loan::accept_loan(ctx, blockhash)
    }

    pub fn return_funds(
        ctx: Context<ReturnFunds>,
        blockhash: u64,
    ) -> Result<()> {
        return_funds::return_funds(ctx, blockhash)
    }

    pub fn close_expired(
        ctx: Context<CloseExpired>,
        blockhash: u64,
    ) -> Result<()> {
        close_expired::close_expired(ctx, blockhash)
    }
}


trait ToPubkey {
    fn to_pubkey(&self) -> Pubkey;
}

impl ToPubkey for &str {
    fn to_pubkey(&self) -> Pubkey {
        Pubkey::from_str(&self).expect("Error parsing public key from string.")
    }
}