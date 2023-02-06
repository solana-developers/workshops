import {
    createCreateMetadataAccountInstruction, PROGRAM_ID,
} from '@metaplex-foundation/mpl-token-metadata'
import {
    AuthorityType,
    createInitializeMintInstruction, 
    createMintToInstruction, 
    createSetAuthorityInstruction, 
    getOrCreateAssociatedTokenAccount, 
    MINT_SIZE, 
    TOKEN_PROGRAM_ID,
    transfer,
} from "@solana/spl-token"
import { 
    Connection, 
    Keypair, 
    PublicKey, 
    SystemProgram, 
} from "@solana/web3.js"
import {
    loadKeypairFromFile
} from '../util/local-configs'
import {
    logBalance,
    logNewKeypair,
    logNewMint,
    logTokenBalance,
    logTransaction,
    newLogSection,
} from '../util/log'
import {
    buildTransaction
} from '../util/transaction'


const connection = new Connection(
    "https://api.devnet.solana.com", 
    {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 60000,
    },
)

const payer = loadKeypairFromFile(
    require('os').homedir() + '/.config/solana/id.json'
)

const testUserKeypair1 = Keypair.generate()
const testUserKeypair2 = Keypair.generate()

const tokenMintKeypair = Keypair.generate()
const nftMintKeypair = Keypair.generate()

async function createAccount(accountName: string, keypair: Keypair) {
    const lamports = 
        await connection.getMinimumBalanceForRentExemption(0) + 100000
    const createAccountInstruction = SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: keypair.publicKey,
        lamports,
        space: 0,
        programId: SystemProgram.programId,
    })
    const createAccountTransaction = await buildTransaction(
        connection, 
        payer.publicKey, 
        [payer, keypair], 
        [createAccountInstruction]
    )
    const signature = await connection.sendTransaction(createAccountTransaction)
    
    newLogSection()
    logNewKeypair(keypair)
    await logTransaction(connection, signature)
    await logBalance(accountName, connection, keypair.publicKey)
}

// SPL Tokens are typically 9 decimals,
//      whereas NFTs are 0 decimals
//
async function createToken(
    mintKeypair: Keypair, 
    decimals: number,
    tokenName: string,
    tokenSymbol: string,
    tokenUri: string,
) {
    // Create the account for the Mint
    const createMintAccountInstruction = SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(MINT_SIZE),
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
    });
    // Initialize that account as a Mint
    const initializeMintInstruction = createInitializeMintInstruction(
        mintKeypair.publicKey,
        decimals,
        payer.publicKey,
        payer.publicKey,
    );
    // Create the Metadata account for the Mint
    const createMetadataInstruction = createCreateMetadataAccountInstruction(
        {
            metadata: PublicKey.findProgramAddressSync(
                [ Buffer.from('metadata'), PROGRAM_ID.toBuffer(), mintKeypair.publicKey.toBuffer() ],
                PROGRAM_ID,
            )[0],
            mint: mintKeypair.publicKey,
            mintAuthority: payer.publicKey,
            payer: payer.publicKey,
            updateAuthority: payer.publicKey,
        },
        {
            createMetadataAccountArgs: {
                data: {
                    creators: null,
                    name: tokenName,
                    symbol: tokenSymbol,
                    uri: tokenUri,
                    sellerFeeBasisPoints: 0,
                },
                isMutable: false,
            }
        }
    )
    const tx = await buildTransaction(
        connection, 
        payer.publicKey, 
        [payer, mintKeypair], 
        [createMintAccountInstruction, initializeMintInstruction, createMetadataInstruction],
    )
    const signature = await connection.sendTransaction(tx)

    newLogSection()
    await logTransaction(connection, signature)
    logNewMint(mintKeypair.publicKey, decimals)
}

async function mintToWallet(
    mintPublicKey: PublicKey,
    mintAuthority: Keypair,
    recipientPublicKey: PublicKey,
    quantity: number,
    freezeMint?: boolean,
) {
    newLogSection()
    console.log(`Minting ${quantity} tokens to recipient: ${recipientPublicKey}`)
    // Create (or get) the recipient's Associated Token Account for the Mint
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mintPublicKey,
        recipientPublicKey,
        )
    console.log(`   Recipient Associated Token Address: ${recipientTokenAccount.address}`)
    const mintToWalletInstruction = createMintToInstruction(
        mintPublicKey,
        recipientTokenAccount.address,
        mintAuthority.publicKey,
        quantity,
    )
    const ixList = [mintToWalletInstruction]
    const signersList = [payer]

    // If it's an NFT, you want to freeze minting after you've minted the first one.
    if (freezeMint) ixList.push(
        createSetAuthorityInstruction(
            mintPublicKey,
            payer.publicKey,
            AuthorityType.MintTokens,
            null,
        )
    )

    const tx = await buildTransaction(
        connection, 
        payer.publicKey, 
        signersList, 
        ixList,
    )
    const signature = await connection.sendTransaction(tx)
    await logTransaction(connection, signature)
    await logTokenBalance("Test Account #1", recipientTokenAccount)
}

async function transferTokens(
    mintPublicKey: PublicKey,
    fromKeypair: Keypair, 
    toPublicKey: PublicKey, 
    quantity: number,
) {
    // Create (or get) the sender's Associated Token Account for the Mint
    const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mintPublicKey,
        fromKeypair.publicKey,
    )
    // Create (or get) the recipient's Associated Token Account for the Mint
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mintPublicKey,
        toPublicKey,
    )

    newLogSection()
    console.log("Starting balances:");
    await logTokenBalance("Test Account #1", senderTokenAccount)
    await logTokenBalance("Test Account #2", recipientTokenAccount)

    // Transfer the tokens
    const signature = await transfer(
        connection,
        payer,
        senderTokenAccount.address,
        recipientTokenAccount.address,
        fromKeypair,
        quantity,
    )
    await logTransaction(connection, signature)

    console.log("Ending balances:");
    await logTokenBalance("Test Account #1", senderTokenAccount)
    await logTokenBalance("Test Account #2", recipientTokenAccount)
}

async function tokensScript() {
    await createAccount("Test User Keypair #1", testUserKeypair1)
    await createAccount("Test User Keypair #2", testUserKeypair2)
    
    // SPL Token
    await createToken(
        tokenMintKeypair, 
        9,
        "Solana Gold",
        "SGOLD",
        "https://raw.githubusercontent.com/solana-developers/workshops/main/workshops/beginner-crash-course/solution/client-examples/assets/my-token.json"
    )
    // NFT
    await createToken(
        nftMintKeypair, 
        0,
        "Homer NFT",
        "HOMR",
        "https://raw.githubusercontent.com/solana-developers/workshops/main/workshops/beginner-crash-course/solution/client-examples/assets/my-nft.json"
    )

    await mintToWallet(
        tokenMintKeypair.publicKey,
        payer,
        testUserKeypair1.publicKey,
        40,
    )
    await mintToWallet(
        nftMintKeypair.publicKey,
        payer,
        testUserKeypair1.publicKey,
        1,
        true,   // Freeze mint since it's an NFT
    )

    await transferTokens(
        tokenMintKeypair.publicKey,
        testUserKeypair1,
        testUserKeypair2.publicKey,
        10,
    )
    await transferTokens(
        nftMintKeypair.publicKey,
        testUserKeypair1,
        testUserKeypair2.publicKey,
        1,
    )
}

tokensScript()