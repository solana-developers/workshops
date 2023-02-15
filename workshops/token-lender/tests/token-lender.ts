import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Keypair } from "@solana/web3.js";
import { TokenLender } from "../target/types/token_lender";
import { 
  assertLoanCreated, 
  assertLoanAccepted, 
  assertPrincipleReturnedToLoan, 
  assertLoanClosed, 
  createKeypairFromFile, 
  USDC_MINT,
  getLoanEscrowPublicKey,
  getLenderPublicKey,
  getMetadataPublicKey,
  SOL_USD_PRICE_FEED_ID
} from "./util";
import { describe, it } from "mocha"

describe("Test Loan Returned", async () => {

  const lender = createKeypairFromFile(require('os').homedir() + '/.config/solana/id.json');
  const borrower = createKeypairFromFile(require('os').homedir() + '/.config/solana/id2.json');
  
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.TokenLender as Program<TokenLender>;
  
  const loanId = 1;
  const deposit = new anchor.BN(1000);
  const [ loanEscrowPublicKey, _ ] = getLoanEscrowPublicKey(program.programId, loanId);
  const loanNoteMint = Keypair.generate();

  it("Create a new loan", async () => {

    const expiryTimestamp = new anchor.BN(
      (await program.provider.connection.getSlot()) + 300
    );

    await program.methods.createLoan(
      loanId, deposit, expiryTimestamp
    )
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
        lenderLoanBook: getLenderPublicKey(program.programId, lender.publicKey)[0],
      })
      .signers([lender])
      .rpc({skipPreflight: true})
    await assertLoanCreated(program, loanEscrowPublicKey)
  });

  // it("Accept that loan", async () => {
  //   await program.methods.acceptLoan(
  //     loanId
  //   )
  //     .accounts({
  //       usdcMint: USDC_MINT,
  //       loanNoteMint: loanNoteMint.publicKey,
  //       loanNoteMintMetadata: getMetadataPublicKey(loanNoteMint.publicKey)[0],
  //       loanEscrow: loanEscrowPublicKey,
  //       loanEscrowUsdcAta: await anchor.utils.token.associatedAddress({
  //         mint: USDC_MINT,
  //         owner: loanEscrowPublicKey,
  //       }),
  //       borrower: lender.publicKey,
  //       borrowerUsdcAta: await anchor.utils.token.associatedAddress({
  //         mint: USDC_MINT,
  //         owner: borrower.publicKey,
  //       }),
  //       lender: lender.publicKey,
  //       lenderLoanNoteMintAta: await anchor.utils.token.associatedAddress({
  //         mint: loanNoteMint.publicKey,
  //         owner: lender.publicKey,
  //       }),
  //       pythAccount: SOL_USD_PRICE_FEED_ID,
  //       tokenMetadataProgram: METADATA_PROGRAM_ID,
  //     })
  //     .signers([borrower, loanNoteMint])
  //     .rpc()
  //   await assertLoanAccepted(program, loanEscrowPublicKey)
  // });
  
  // it("Return that loan", async () => {
  //   await program.methods.returnFunds(
  //     loanId, deposit
  //   )
  //     .accounts({
  //       usdcMint: USDC_MINT,
  //       loanEscrow: loanEscrowPublicKey,
  //       loanEscrowUsdcAta: await anchor.utils.token.associatedAddress({
  //         mint: USDC_MINT,
  //         owner: loanEscrowPublicKey,
  //       }),
  //       borrower: lender.publicKey,
  //       borrowerUsdcAta: await anchor.utils.token.associatedAddress({
  //         mint: USDC_MINT,
  //         owner: borrower.publicKey,
  //       }),
  //     })
  //     .signers([borrower])
  //     .rpc()
  //   await assertPrincipleReturnedToLoan(program, loanEscrowPublicKey)
  // });
  
  // it("Close that loan as returned", async () => {
  //   await program.methods.closeReturned(
  //     loanId
  //   )
  //     .accounts({
  //       usdcMint: USDC_MINT,
  //       loanNoteMint: loanNoteMint.publicKey,
  //       loanEscrow: loanEscrowPublicKey,
  //       loanEscrowLoanNoteMintAta: await anchor.utils.token.associatedAddress({
  //         mint: loanNoteMint.publicKey,
  //         owner: loanEscrowPublicKey,
  //       }),
  //       loanEscrowUsdcAta: await anchor.utils.token.associatedAddress({
  //         mint: USDC_MINT,
  //         owner: loanEscrowPublicKey,
  //       }),
  //       lender: lender.publicKey,
  //       lenderLoanNoteMintAta: await anchor.utils.token.associatedAddress({
  //         mint: loanNoteMint.publicKey,
  //         owner: lender.publicKey,
  //       }),
  //       lenderUsdcAta: await anchor.utils.token.associatedAddress({
  //         mint: USDC_MINT,
  //         owner: lender.publicKey,
  //       }),
  //     })
  //     .signers([lender])
  //     .rpc()
  //   await assertLoanClosed(program, loanEscrowPublicKey)
  // });

});

// describe("Test Loan Defaulted", async () => {

//   const lender = createKeypairFromFile(require('os').homedir() + '/.config/solana/id.json');
//   const borrower = createKeypairFromFile(require('os').homedir() + '/.config/solana/id2.json');
  
//   anchor.setProvider(anchor.AnchorProvider.env());
//   const program = anchor.workspace.TokenLender as Program<TokenLender>;

//   const loanId = 2;
//   const deposit = new anchor.BN(2000);
//   const [ loanEscrowPublicKey, loanEscrowBump ] = getLoanEscrowPublicKey(program.programId, loanId);
//   const loanNoteMint = Keypair.generate();

//   it("Create a new loan", async () => {

//     const expiryTimestamp = new anchor.BN(
//       (await program.provider.connection.getSlot()) + 300
//     );

//     await program.methods.createLoan(
//       loanId, deposit, expiryTimestamp
//     )
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
//         lenderLoanBook: getLenderPublicKey(program.programId, lender.publicKey)[0],
//       })
//       .signers([lender])
//       .rpc()
//     await assertLoanCreated(program, loanEscrowPublicKey)
//   });

//   it("Accept that loan", async () => {
//     await program.methods.acceptLoan(
//       loanId
//     )
//       .accounts({
//         usdcMint: USDC_MINT,
//         loanNoteMint: loanNoteMint.publicKey,
//         loanNoteMintMetadata: getMetadataPublicKey(loanNoteMint.publicKey)[0],
//         loanEscrow: loanEscrowPublicKey,
//         loanEscrowUsdcAta: await anchor.utils.token.associatedAddress({
//           mint: USDC_MINT,
//           owner: loanEscrowPublicKey,
//         }),
//         borrower: lender.publicKey,
//         borrowerUsdcAta: await anchor.utils.token.associatedAddress({
//           mint: USDC_MINT,
//           owner: borrower.publicKey,
//         }),
//         lender: lender.publicKey,
//         lenderLoanNoteMintAta: await anchor.utils.token.associatedAddress({
//           mint: loanNoteMint.publicKey,
//           owner: lender.publicKey,
//         }),
//         pythAccount: SOL_USD_PRICE_FEED_ID,
//         tokenMetadataProgram: METADATA_PROGRAM_ID,
//       })
//       .signers([borrower, loanNoteMint])
//       .rpc()
//     await assertLoanAccepted(program, loanEscrowPublicKey)
//   });
  
//   it("Close that loan as expired", async () => {
//     await program.methods.closeExpired(
//       loanId
//     )
//       .accounts({
//         usdcMint: USDC_MINT,
//         loanNoteMint: loanNoteMint.publicKey,
//         loanEscrow: loanEscrowPublicKey,
//         loanEscrowLoanNoteMintAta: await anchor.utils.token.associatedAddress({
//           mint: loanNoteMint.publicKey,
//           owner: loanEscrowPublicKey,
//         }),
//         loanEscrowUsdcAta: await anchor.utils.token.associatedAddress({
//           mint: USDC_MINT,
//           owner: loanEscrowPublicKey,
//         }),
//         lender: lender.publicKey,
//         lenderLoanNoteMintAta: await anchor.utils.token.associatedAddress({
//           mint: loanNoteMint.publicKey,
//           owner: lender.publicKey,
//         }),
//         lenderUsdcAta: await anchor.utils.token.associatedAddress({
//           mint: USDC_MINT,
//           owner: lender.publicKey,
//         }),
//       })
//       .signers([lender])
//       .rpc()
//     await assertLoanClosed(program, loanEscrowPublicKey)
//   });

// });
