use anchor_lang::prelude::*;

use std::str::FromStr;

pub trait ToPubkey {
    fn to_pubkey(&self) -> Pubkey;
}

impl ToPubkey for &str {
    fn to_pubkey(&self) -> Pubkey {
        Pubkey::from_str(&self).expect("Error parsing public key from string.")
    }
}

pub trait Seeds {
    fn to_seed(&self) -> Box<[u8]>;
}

impl Seeds for &str {
    fn to_seed(&self) -> Box<[u8]> {
        self.as_bytes().as_ref().into()
    }
}

impl Seeds for u32 {
    fn to_seed(&self) -> Box<[u8]> {
        self.to_le_bytes().as_ref().into()
    }
}
