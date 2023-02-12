use anchor_lang::prelude::*;

#[account]
pub struct Escrow {
    pub borrower: Option<Pubkey>,
    pub lender: Pubkey,
    // lending amount in SOL/lamports, tbd
    pub deposit: u64,
    pub bump: u8,
    pub expiry_timestamp: i64,
    pub initialized: bool,
}