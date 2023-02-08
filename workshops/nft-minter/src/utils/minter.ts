import { bundlrStorage, Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { PROGRAM_ID } from "@metaplex-foundation/mpl-auction-house";
import { createCreateMetadataAccountInstruction } from "@metaplex-foundation/mpl-token-metadata";
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMintInstruction } from "@solana/spl-token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, Keypair, PublicKey, SystemProgram, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";

// The new Metaplex JS SDK
export async function mintWithMetaplexJs(
    connection: Connection,
    networkConfiguration: string, 
    wallet: WalletContextState,
    tokenName: string,
    tokenSymbol: string,
    tokenDescription: string,
    createObjectURL: string,
): Promise<[string, string]> {

    const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet))
        .use(bundlrStorage({ address: `https://${networkConfiguration}.bundlr.network` }));
    const { uri } = await metaplex.nfts().uploadMetadata({
        name: tokenName,
        symbol: tokenSymbol,
        description: tokenDescription,
        image: createObjectURL,
    });
    const { mintAddress, response } = await metaplex.nfts().create({
        name: tokenName,
        uri: uri,
        sellerFeeBasisPoints: 0,
        tokenOwner: wallet.publicKey,
        mintTokens: true,
    });
    return [mintAddress.toBase58(), response.signature];
}

// The legacy MPL Token Metadata SDK
export async function mintWithMplTokenMetadata(
    connection: Connection,
    networkConfiguration: string, 
    wallet: WalletContextState,
    tokenName: string,
    tokenSymbol: string,
    tokenDescription: string,
    createObjectURL: string,
): Promise<[string, string]> {
    const mintKeypair = Keypair.generate();
    const metadataJson = {
        title: tokenName,
        symbol: tokenSymbol,
        description: tokenDescription,
        image: createObjectURL,
    };
    //
    // TODO: Upload the Metadata JSON to Arweave
    // 
    const tx = await buildTransaction(
        connection, 
        wallet.publicKey, 
        [
            // Create the account for the Mint
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: mintKeypair.publicKey,
                lamports: await connection.getMinimumBalanceForRentExemption(MINT_SIZE),
                space: MINT_SIZE,
                programId: TOKEN_PROGRAM_ID,
            }),
            // Initialize that account as a Mint
            createInitializeMintInstruction(
                mintKeypair.publicKey,
                0,
                wallet.publicKey,
                wallet.publicKey,
            ),
            // Create the Metadata account for the Mint
            createCreateMetadataAccountInstruction(
                {
                    metadata: PublicKey.findProgramAddressSync(
                        [ Buffer.from('metadata'), PROGRAM_ID.toBuffer(), mintKeypair.publicKey.toBuffer() ],
                        PROGRAM_ID,
                    )[0],
                    mint: mintKeypair.publicKey,
                    mintAuthority: wallet.publicKey,
                    payer: wallet.publicKey,
                    updateAuthority: wallet.publicKey,
                },
                {
                    createMetadataAccountArgs: {
                        data: {
                            creators: null,
                            name: tokenName,
                            symbol: tokenSymbol,
                            uri: "",                    // TODO
                            sellerFeeBasisPoints: 0,
                        },
                        isMutable: false,
                    }
                }
            )
        ],
    );
    const signature = await wallet.sendTransaction(tx, connection);
    return [mintKeypair.publicKey.toBase58(), signature];
}

// Builds a Versioned Transaction
export async function buildTransaction(
    connection: Connection,
    payer: PublicKey,
    instructions: TransactionInstruction[]
): Promise<VersionedTransaction> {

    let blockhash = await connection
        .getLatestBlockhash()
        .then((res) => res.blockhash)
    const messageV0 = new TransactionMessage({
        payerKey: payer,
        recentBlockhash: blockhash,
        instructions,
    }).compileToV0Message()
    const tx = new VersionedTransaction(messageV0)
    return tx
}