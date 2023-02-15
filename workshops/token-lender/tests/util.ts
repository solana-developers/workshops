import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { TokenLender } from "../target/types/token_lender";
import { getAccount } from "@solana/spl-token";
import { Keypair, PublicKey } from "@solana/web3.js";
import { assert } from "chai";

export const SOL_USD_PRICE_FEED_ID = new PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix");
export const USDC_MINT = new PublicKey("Awy3qcokrpKMH7ustbAnfibhSehVtnmWhAFiVrimV157");

export const LOAN_BOOK_SEED_PREFIX = "loan_book";
export const LOAN_ESCROW_SEED_PREFIX = "loan_escrow";

export function createKeypairFromFile(path: string): Keypair {
    return Keypair.fromSecretKey(
        Buffer.from(JSON.parse(require('fs').readFileSync(path, "utf-8")))
    )
};

export function getMetadataPublicKey(mint: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata"),
            METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
        ],
        METADATA_PROGRAM_ID,
    )
}

export function getLenderLoanBookPublicKey(programId: PublicKey, lender: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from(LOAN_BOOK_SEED_PREFIX),
            lender.toBuffer(),
        ],
        programId,
    )
}

export function getLoanEscrowPublicKey(programId: PublicKey, loanId: number): [PublicKey, number] {
    const [key, bump] = PublicKey.findProgramAddressSync(
        [
            Buffer.from(LOAN_ESCROW_SEED_PREFIX),
            Buffer.from(Uint8Array.of(loanId)),
        ],
        programId,
    )
    console.log(`Key: ${key}`)
    return [key, bump]
}

function printLoan(loan: anchor.IdlTypes<anchor.Idl>["LoanEscrow"], status: string) {
    console.log(`Loan ${status}:`)
    console.log("-----------------------------------------------------")
    console.log(`   Lender:     ${loan.lender.toBase58()}`)
    console.log(`   Deposit:    ${loan.deposit.toNumber()}`)
    console.log(`   Expiration: ${loan.expiryTimestamp.toNumber()}`)
    console.log(`   Borrower:   ${loan.borrower.toBase58()}`)
    console.log("-----------------------------------------------------")
}

export async function assertLoanCreated(
    program: Program<TokenLender>,
    loanEscrowPublicKey: PublicKey,
) {
    assert(
        program.account.loanEscrow.fetch(loanEscrowPublicKey)
            .then((loan) => {
                printLoan(loan, "created")
                return true
            })
            .catch((_) => { return false }),
        "Loan was not created."
    )
}

export async function assertLoanAccepted(
    program: Program<TokenLender>,
    loanEscrowPublicKey: PublicKey,
) {
    assert(
        program.account.loanEscrow.fetch(loanEscrowPublicKey)
            .then((loan) => {
                printLoan(loan, "accepted")
                return loan.borrower ? true : false;
            })
            .catch((_) => { return false }),
        "Loan was not accepted."
    )
}

export async function assertLoanClosed(
    program: Program<TokenLender>,
    loanEscrowPublicKey: PublicKey,
) {
    assert(
        await program.provider.connection.getBalance(loanEscrowPublicKey) === 0,
        "SOL balance was not 0."
    )
    assert(
        Number((await getAccount(
            program.provider.connection,
            await anchor.utils.token.associatedAddress({
                mint: USDC_MINT,
                owner: loanEscrowPublicKey,
            }),
        )).amount) === 0,
        "USDC balance was not 0."
    )
}

export async function assertPrincipleReturnedToLoan(
    program: Program<TokenLender>,
    loanEscrowPublicKey: PublicKey,
) {
    const loan = await program.account.loanEscrow.fetch(loanEscrowPublicKey)
    assert(
        Number((await getAccount(
            program.provider.connection,
            await anchor.utils.token.associatedAddress({
                mint: USDC_MINT,
                owner: loanEscrowPublicKey,
            }),
        )).amount) === loan.deposit.toNumber(),
        "USDC balance was not equal to deposit."
    )
}
