import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import {
  Idl,
  IdlTypes,
  Program,
  utils as anchorUtil,
} from "@project-serum/anchor";
import { getAccount } from "@solana/spl-token";
import { Keypair, PublicKey } from "@solana/web3.js";
import { assert } from "chai";
import { TokenLender } from "../target/types/token_lender";

export const SOL_USD_PRICE_FEED_ID = new PublicKey(
  "J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix"
);
export const USDC_MINT = new PublicKey(
  "79MBKfDRce7r2cUMiidckfSZ2SAG14fa75GosYxtcwg8"
);

export const LOAN_ESCROW_SEED_PREFIX = "loan_escrow";
export const LOAN_NOTE_MINT_SEED_PREFIX = "loan_note_mint";

export function createKeypairFromFile(path: string): Keypair {
  return Keypair.fromSecretKey(
    Buffer.from(JSON.parse(require("fs").readFileSync(path, "utf-8")))
  );
}

export function getMetadataPublicKey(mint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    METADATA_PROGRAM_ID
  );
}

export function getLoanEscrowPublicKey(
  programId: PublicKey,
  loanId: number
): [PublicKey, number] {
  const [key, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from(LOAN_ESCROW_SEED_PREFIX), Buffer.from(Uint8Array.of(loanId))],
    programId
  );
  return [key, bump];
}

export function getLoanNoteMintPublicKey(
  programId: PublicKey,
  loanEscrowPublicKey: PublicKey
): [PublicKey, number] {
  const [key, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from(LOAN_NOTE_MINT_SEED_PREFIX), loanEscrowPublicKey.toBuffer()],
    programId
  );
  return [key, bump];
}

export async function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

function printLoan(
  pubkey: PublicKey,
  loan: IdlTypes<Idl>["LoanEscrow"],
  status: string
) {
  console.log(`Loan ${status}:`);
  console.log("-----------------------------------------------------");
  console.log(`   Loan:       ${pubkey.toBase58()}`);
  console.log(`   Lender:     ${loan.lender.toBase58()}`);
  console.log(`   Deposit:    ${loan.deposit.toNumber()}`);
  console.log(`   Expiration: ${loan.expiryTimestamp.toNumber()}`);
  console.log(`   Borrower:   ${loan.borrower.toBase58()}`);
  console.log("-----------------------------------------------------");
}

export async function assertLoanCreated(
  program: Program<TokenLender>,
  loanEscrowPublicKey: PublicKey
) {
  await sleep(2);
  assert(
    program.account.loanEscrow
      .fetch(loanEscrowPublicKey)
      .then((loan) => {
        printLoan(loanEscrowPublicKey, loan, "created");
        return true;
      })
      .catch((_) => {
        return false;
      }),
    "Loan was not created."
  );
}

export async function assertLoanAccepted(
  program: Program<TokenLender>,
  loanEscrowPublicKey: PublicKey
) {
  await sleep(2);
  assert(
    program.account.loanEscrow
      .fetch(loanEscrowPublicKey)
      .then((loan) => {
        printLoan(loanEscrowPublicKey, loan, "accepted");
        return loan.borrower ? true : false;
      })
      .catch((_) => {
        return false;
      }),
    "Loan was not accepted."
  );
}

export async function assertLoanClosed(
  program: Program<TokenLender>,
  loanEscrowPublicKey: PublicKey
) {
  await sleep(2);
  assert(
    (await program.provider.connection.getBalance(loanEscrowPublicKey)) === 0,
    "SOL balance was not 0."
  );
  const escrowUsdcBalance = Number(
    (
      await getAccount(
        program.provider.connection,
        await anchorUtil.token.associatedAddress({
          mint: USDC_MINT,
          owner: loanEscrowPublicKey,
        })
      )
    ).amount
  );
  assert(
    escrowUsdcBalance === 0,
    `USDC balance was not 0. It was ${escrowUsdcBalance}`
  );
}

export async function assertPrincipleReturnedToLoan(
  program: Program<TokenLender>,
  loanEscrowPublicKey: PublicKey
) {
  await sleep(2);
  const loan = await program.account.loanEscrow.fetch(loanEscrowPublicKey);
  assert(
    Number(
      (
        await getAccount(
          program.provider.connection,
          await anchorUtil.token.associatedAddress({
            mint: USDC_MINT,
            owner: loanEscrowPublicKey,
          })
        )
      ).amount
    ) === loan.deposit.toNumber(),
    "USDC balance was not equal to deposit."
  );
}
