use anchor_lang::prelude::*;

#[account]
pub struct LoanEscrow {
    pub lender: Pubkey,
    pub borrower: Option<Pubkey>,
    pub deposit: u64,               // USDC
    pub expiry_timestamp: u64,
    pub loan_id: u32,
    pub bump: u8,
}

impl LoanEscrow {
    pub const SEED_PREFIX: &'static str = "loan_escrow";
}

#[account]
pub struct LenderLoanBook {
    pub lender: Pubkey,
    pub loan_count: u32,
    pub bump: u8,
}

impl LenderLoanBook {
    pub const SEED_PREFIX: &'static str = "loan_book";
}