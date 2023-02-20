use anchor_lang::prelude::*;

#[account]
pub struct LoanEscrow {
    pub lender: Pubkey,
    pub borrower: Pubkey,
    pub deposit: u64, // USDC
    pub expiry_timestamp: u64,
    pub loan_id: u8,
    pub bump: u8,
}

impl LoanEscrow {
    pub const SEED_PREFIX: &'static str = "loan_escrow";
}
