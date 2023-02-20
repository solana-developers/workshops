import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { describe, it } from "mocha";
import { TokenLender } from "../target/types/token_lender";
import {
  assertLoanCreated,
  createKeypairFromFile,
  getLoanEscrowPublicKey,
  getLoanNoteMintPublicKey,
  USDC_MINT,
} from "./util";

describe("[Unit Test]: Loan Returned", async () => {
  const lender = createKeypairFromFile(
    require("os").homedir() + "/.config/solana/id.json"
  );
  const borrower = createKeypairFromFile(
    require("os").homedir() + "/.config/solana/id2.json"
  );

  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.TokenLender as Program<TokenLender>;

  const loanId = 5;
  const deposit = new anchor.BN(1000);
  const [loanEscrowPublicKey, _] = getLoanEscrowPublicKey(
    program.programId,
    loanId
  );
  const loanNoteMintPublicKey = getLoanNoteMintPublicKey(
    program.programId,
    loanEscrowPublicKey
  )[0];

  it("Create a new loan", async () => {
    const expiryTimestamp = new anchor.BN(
      (await program.provider.connection.getSlot()) + 300
    );

    await program.methods
      .createLoan(loanId, deposit, expiryTimestamp)
      .accounts({
        usdcMint: USDC_MINT,
        loanEscrow: loanEscrowPublicKey,
        loanEscrowUsdcAta: await anchor.utils.token.associatedAddress({
          mint: USDC_MINT,
          owner: loanEscrowPublicKey,
        }),
        lender: lender.publicKey,
        lenderUsdcAta: await anchor.utils.token.associatedAddress({
          mint: USDC_MINT,
          owner: lender.publicKey,
        }),
      })
      .signers([lender])
      .rpc();
    await assertLoanCreated(program, loanEscrowPublicKey);
  });

  // it("Accept that loan", async () => {
  //   await program.methods
  //     .acceptLoan(loanId)
  //     .accounts({
  //       usdcMint: USDC_MINT,
  //       loanNoteMint: loanNoteMintPublicKey,
  //       loanNoteMintMetadata: getMetadataPublicKey(loanNoteMintPublicKey)[0],
  //       loanEscrow: loanEscrowPublicKey,
  //       loanEscrowUsdcAta: await anchor.utils.token.associatedAddress({
  //         mint: USDC_MINT,
  //         owner: loanEscrowPublicKey,
  //       }),
  //       borrower: borrower.publicKey,
  //       borrowerUsdcAta: await anchor.utils.token.associatedAddress({
  //         mint: USDC_MINT,
  //         owner: borrower.publicKey,
  //       }),
  //       lender: lender.publicKey,
  //       lenderLoanNoteMintAta: await anchor.utils.token.associatedAddress({
  //         mint: loanNoteMintPublicKey,
  //         owner: lender.publicKey,
  //       }),
  //       pythAccount: SOL_USD_PRICE_FEED_ID,
  //       tokenMetadataProgram: METADATA_PROGRAM_ID,
  //     })
  //     .signers([borrower])
  //     .rpc({ skipPreflight: true });
  //   await assertLoanAccepted(program, loanEscrowPublicKey);
  // });

  // it("Return that loan", async () => {
  //   await program.methods
  //     .returnFunds(loanId, deposit)
  //     .accounts({
  //       usdcMint: USDC_MINT,
  //       loanEscrow: loanEscrowPublicKey,
  //       loanEscrowUsdcAta: await anchor.utils.token.associatedAddress({
  //         mint: USDC_MINT,
  //         owner: loanEscrowPublicKey,
  //       }),
  //       borrower: borrower.publicKey,
  //       borrowerUsdcAta: await anchor.utils.token.associatedAddress({
  //         mint: USDC_MINT,
  //         owner: borrower.publicKey,
  //       }),
  //     })
  //     .signers([borrower])
  //     .rpc();
  //   await assertPrincipleReturnedToLoan(program, loanEscrowPublicKey);
  // });

  // it("Close that loan as returned", async () => {
  //   await program.methods
  //     .closeReturned(loanId)
  //     .accounts({
  //       usdcMint: USDC_MINT,
  //       loanNoteMint: loanNoteMintPublicKey,
  //       loanEscrow: loanEscrowPublicKey,
  //       loanEscrowLoanNoteMintAta: await anchor.utils.token.associatedAddress({
  //         mint: loanNoteMintPublicKey,
  //         owner: loanEscrowPublicKey,
  //       }),
  //       loanEscrowUsdcAta: await anchor.utils.token.associatedAddress({
  //         mint: USDC_MINT,
  //         owner: loanEscrowPublicKey,
  //       }),
  //       lender: lender.publicKey,
  //       lenderLoanNoteMintAta: await anchor.utils.token.associatedAddress({
  //         mint: loanNoteMintPublicKey,
  //         owner: lender.publicKey,
  //       }),
  //       lenderUsdcAta: await anchor.utils.token.associatedAddress({
  //         mint: USDC_MINT,
  //         owner: lender.publicKey,
  //       }),
  //     })
  //     .signers([lender])
  //     .rpc();
  //   await assertLoanClosed(program, loanEscrowPublicKey);
  // });
});

// describe("[Unit Test]: Loan Defaulted", async () => {
//   const lender = createKeypairFromFile(
//     require("os").homedir() + "/.config/solana/id.json"
//   );
//   const borrower = createKeypairFromFile(
//     require("os").homedir() + "/.config/solana/id2.json"
//   );

//   anchor.setProvider(anchor.AnchorProvider.env());
//   const program = anchor.workspace.TokenLender as Program<TokenLender>;

//   const loanId = 4;
//   const deposit = new anchor.BN(2000);
//   const [loanEscrowPublicKey, _] = getLoanEscrowPublicKey(
//     program.programId,
//     loanId
//   );
//   const loanNoteMintPublicKey = getLoanNoteMintPublicKey(
//     program.programId,
//     loanEscrowPublicKey
//   )[0];

//   it("Create a new loan", async () => {
//     const expiryTimestamp = new anchor.BN(
//       (await program.provider.connection.getSlot()) + 10
//     );

//     await program.methods
//       .createLoan(loanId, deposit, expiryTimestamp)
//       .accounts({
//         usdcMint: USDC_MINT,
//         loanEscrow: loanEscrowPublicKey,
//         loanEscrowUsdcAta: await anchor.utils.token.associatedAddress({
//           mint: USDC_MINT,
//           owner: loanEscrowPublicKey,
//         }),
//         lender: lender.publicKey,
//         lenderUsdcAta: await anchor.utils.token.associatedAddress({
//           mint: USDC_MINT,
//           owner: lender.publicKey,
//         }),
//       })
//       .signers([lender])
//       .rpc();
//     await assertLoanCreated(program, loanEscrowPublicKey);
//   });

//   it("Accept that loan", async () => {
//     await program.methods
//       .acceptLoan(loanId)
//       .accounts({
//         usdcMint: USDC_MINT,
//         loanNoteMint: loanNoteMintPublicKey,
//         loanNoteMintMetadata: getMetadataPublicKey(loanNoteMintPublicKey)[0],
//         loanEscrow: loanEscrowPublicKey,
//         loanEscrowUsdcAta: await anchor.utils.token.associatedAddress({
//           mint: USDC_MINT,
//           owner: loanEscrowPublicKey,
//         }),
//         borrower: borrower.publicKey,
//         borrowerUsdcAta: await anchor.utils.token.associatedAddress({
//           mint: USDC_MINT,
//           owner: borrower.publicKey,
//         }),
//         lender: lender.publicKey,
//         lenderLoanNoteMintAta: await anchor.utils.token.associatedAddress({
//           mint: loanNoteMintPublicKey,
//           owner: lender.publicKey,
//         }),
//         pythAccount: SOL_USD_PRICE_FEED_ID,
//         tokenMetadataProgram: METADATA_PROGRAM_ID,
//       })
//       .signers([borrower])
//       .rpc();
//     await assertLoanAccepted(program, loanEscrowPublicKey);
//   });

//   it("Close that loan as expired", async () => {
//     await sleep(5);
//     await program.methods
//       .closeExpired(loanId)
//       .accounts({
//         usdcMint: USDC_MINT,
//         loanNoteMint: loanNoteMintPublicKey,
//         loanEscrow: loanEscrowPublicKey,
//         loanEscrowLoanNoteMintAta: await anchor.utils.token.associatedAddress({
//           mint: loanNoteMintPublicKey,
//           owner: loanEscrowPublicKey,
//         }),
//         loanEscrowUsdcAta: await anchor.utils.token.associatedAddress({
//           mint: USDC_MINT,
//           owner: loanEscrowPublicKey,
//         }),
//         lender: lender.publicKey,
//         lenderLoanNoteMintAta: await anchor.utils.token.associatedAddress({
//           mint: loanNoteMintPublicKey,
//           owner: lender.publicKey,
//         }),
//         lenderUsdcAta: await anchor.utils.token.associatedAddress({
//           mint: USDC_MINT,
//           owner: lender.publicKey,
//         }),
//         clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
//       })
//       .signers([lender])
//       .rpc();
//     await assertLoanClosed(program, loanEscrowPublicKey);
//   });
// });
