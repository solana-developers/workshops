import { PublicKey } from '@solana/web3.js';

export const SOL_USD_PRICE_FEED_ID = new PublicKey(
    'J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix',
);
export const USDC_MINT = new PublicKey(
    '79MBKfDRce7r2cUMiidckfSZ2SAG14fa75GosYxtcwg8',
);

export const LOAN_ESCROW_SEED_PREFIX = 'loan_escrow';
export const LOAN_NOTE_MINT_SEED_PREFIX = 'loan_note_mint';

export const REQUIRED_FLOAT_PERCENTAGE = 75;

export type LoanStatus = 'available' | 'claimed' | 'closed';
