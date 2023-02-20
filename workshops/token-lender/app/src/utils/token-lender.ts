import { PROGRAM_ID as METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { BN, Program, utils as anchorUtil } from '@project-serum/anchor';
import {
    Connection,
    PublicKey,
    SYSVAR_CLOCK_PUBKEY,
    TransactionInstruction,
} from '@solana/web3.js';
import { TokenLender } from 'idl/token_lender';
import {
    LOAN_ESCROW_SEED_PREFIX,
    LOAN_NOTE_MINT_SEED_PREFIX,
    REQUIRED_FLOAT_PERCENTAGE,
    SOL_USD_PRICE_FEED_ID,
    USDC_MINT,
} from './const';

export function getMetadataPublicKey(mint: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from('metadata'),
            METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
        ],
        METADATA_PROGRAM_ID,
    );
}

export function getLoanEscrowPublicKey(
    programId: PublicKey,
    loanId: number,
): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from(LOAN_ESCROW_SEED_PREFIX),
            Buffer.from(Uint8Array.of(loanId)),
        ],
        programId,
    );
}

export function getLoanNoteMintPublicKey(
    programId: PublicKey,
    loanEscrowPublicKey: PublicKey,
): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from(LOAN_NOTE_MINT_SEED_PREFIX),
            loanEscrowPublicKey.toBuffer(),
        ],
        programId,
    );
}

export async function calculate3MinExpiration(
    connection: Connection,
): Promise<number> {
    const currentSlot = await connection.getSlot();
    return currentSlot + 154 * 3; // Avg slots per minute x 3
}

// Calculation: collateral = principle + (principle * 0.75) + (interest / 12) * principle * 12
// or: collateral = principle + float amount + 12mo interest
//
// Collateral is first calculated in USDC, then finally converted to SOL using Pyth
//
export function calculateEstimatedCollateral(
    principle: number,
    interest: number,
): number {
    const collateralUsdc =
        principle +
        principle * REQUIRED_FLOAT_PERCENTAGE +
        (interest / 12) * principle * 12;
    return 0.05;
}

export async function createCreateNewLoanInstruction(
    program: Program<TokenLender>,
    loanId: number,
    deposit: BN,
    expiration: BN,
    lender: PublicKey,
): Promise<TransactionInstruction> {
    const loanEscrowPublicKey = getLoanEscrowPublicKey(
        program.programId,
        loanId,
    )[0];
    return program.methods
        .createLoan(loanId, deposit, expiration)
        .accounts({
            usdcMint: USDC_MINT,
            loanEscrow: loanEscrowPublicKey,
            loanEscrowUsdcAta: await anchorUtil.token.associatedAddress({
                mint: USDC_MINT,
                owner: loanEscrowPublicKey,
            }),
            lender,
            lenderUsdcAta: await anchorUtil.token.associatedAddress({
                mint: USDC_MINT,
                owner: lender,
            }),
        })
        .instruction();
}

export async function createAcceptLoanInstruction(
    program: Program<TokenLender>,
    loanId: number,
    borrower: PublicKey,
    lender: PublicKey,
): Promise<TransactionInstruction> {
    const loanEscrowPublicKey = getLoanEscrowPublicKey(
        program.programId,
        loanId,
    )[0];
    const loanNoteMintPublicKey = getLoanNoteMintPublicKey(
        program.programId,
        loanEscrowPublicKey,
    )[0];
    return program.methods
        .acceptLoan(loanId)
        .accounts({
            usdcMint: USDC_MINT,
            loanNoteMint: loanNoteMintPublicKey,
            loanNoteMintMetadata: getMetadataPublicKey(
                loanNoteMintPublicKey,
            )[0],
            loanEscrow: loanEscrowPublicKey,
            loanEscrowUsdcAta: await anchorUtil.token.associatedAddress({
                mint: USDC_MINT,
                owner: loanEscrowPublicKey,
            }),
            borrower,
            borrowerUsdcAta: await anchorUtil.token.associatedAddress({
                mint: USDC_MINT,
                owner: borrower,
            }),
            lender,
            lenderLoanNoteMintAta: await anchorUtil.token.associatedAddress({
                mint: loanNoteMintPublicKey,
                owner: lender,
            }),
            pythAccount: SOL_USD_PRICE_FEED_ID,
            tokenMetadataProgram: METADATA_PROGRAM_ID,
        })
        .instruction();
}

export async function createReturnFundsInstruction(
    program: Program<TokenLender>,
    loanId: number,
    amount: BN,
    borrower: PublicKey,
): Promise<TransactionInstruction> {
    const loanEscrowPublicKey = getLoanEscrowPublicKey(
        program.programId,
        loanId,
    )[0];
    return program.methods
        .returnFunds(loanId, amount)
        .accounts({
            usdcMint: USDC_MINT,
            loanEscrow: loanEscrowPublicKey,
            loanEscrowUsdcAta: await anchorUtil.token.associatedAddress({
                mint: USDC_MINT,
                owner: loanEscrowPublicKey,
            }),
            borrower,
            borrowerUsdcAta: await anchorUtil.token.associatedAddress({
                mint: USDC_MINT,
                owner: borrower,
            }),
        })
        .instruction();
}

export async function createCloseReturnedInstruction(
    program: Program<TokenLender>,
    loanId: number,
    lender: PublicKey,
): Promise<TransactionInstruction> {
    const loanEscrowPublicKey = getLoanEscrowPublicKey(
        program.programId,
        loanId,
    )[0];
    const loanNoteMintPublicKey = getLoanNoteMintPublicKey(
        program.programId,
        loanEscrowPublicKey,
    )[0];
    return program.methods
        .closeReturned(loanId)
        .accounts({
            usdcMint: USDC_MINT,
            loanNoteMint: loanNoteMintPublicKey,
            loanEscrow: loanEscrowPublicKey,
            loanEscrowLoanNoteMintAta: await anchorUtil.token.associatedAddress(
                {
                    mint: loanNoteMintPublicKey,
                    owner: loanEscrowPublicKey,
                },
            ),
            loanEscrowUsdcAta: await anchorUtil.token.associatedAddress({
                mint: USDC_MINT,
                owner: loanEscrowPublicKey,
            }),
            lender,
            lenderLoanNoteMintAta: await anchorUtil.token.associatedAddress({
                mint: loanNoteMintPublicKey,
                owner: lender,
            }),
            lenderUsdcAta: await anchorUtil.token.associatedAddress({
                mint: USDC_MINT,
                owner: lender,
            }),
        })
        .instruction();
}

export async function createCloseExpiredInstruction(
    program: Program<TokenLender>,
    loanId: number,
    lender: PublicKey,
): Promise<TransactionInstruction> {
    const loanEscrowPublicKey = getLoanEscrowPublicKey(
        program.programId,
        loanId,
    )[0];
    const loanNoteMintPublicKey = getLoanNoteMintPublicKey(
        program.programId,
        loanEscrowPublicKey,
    )[0];
    return program.methods
        .closeExpired(loanId)
        .accounts({
            usdcMint: USDC_MINT,
            loanNoteMint: loanNoteMintPublicKey,
            loanEscrow: loanEscrowPublicKey,
            loanEscrowLoanNoteMintAta: await anchorUtil.token.associatedAddress(
                {
                    mint: loanNoteMintPublicKey,
                    owner: loanEscrowPublicKey,
                },
            ),
            loanEscrowUsdcAta: await anchorUtil.token.associatedAddress({
                mint: USDC_MINT,
                owner: loanEscrowPublicKey,
            }),
            lender,
            lenderLoanNoteMintAta: await anchorUtil.token.associatedAddress({
                mint: loanNoteMintPublicKey,
                owner: lender,
            }),
            lenderUsdcAta: await anchorUtil.token.associatedAddress({
                mint: USDC_MINT,
                owner: lender,
            }),
            clock: SYSVAR_CLOCK_PUBKEY,
        })
        .instruction();
}
