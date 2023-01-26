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
    logAccountInfo, 
    logBalance,
    logNewKeypair,
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

const keypairA = Keypair.generate()
const keypairB = Keypair.generate()

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

async function getAccountData(publicKey: PublicKey) {
    const accountInfo = await connection.getAccountInfo(publicKey)
    newLogSection()
    logAccountInfo(accountInfo)
}

async function transferSol(fromKeypair: Keypair, toPublicKey: PublicKey) {
    
    newLogSection()
    console.log("Starting balances:");
    await logBalance("Account A", connection, keypairA.publicKey)
    await logBalance("Account B", connection, keypairB.publicKey)

    const transferInstruction = SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports: 90000,
    })
    const transferTransaction = await buildTransaction(
        connection, 
        fromKeypair.publicKey,
        [fromKeypair], 
        [transferInstruction]
    )
    const signature = await connection.sendTransaction(transferTransaction)
    await logTransaction(connection, signature)

    console.log("Ending balances:");
    await logBalance("Account A", connection, keypairA.publicKey)
    await logBalance("Account B", connection, keypairB.publicKey)
}

async function accountsScript() {
    await createAccount("Account A", keypairA);
    await getAccountData(keypairA.publicKey);
    await createAccount("Account B", keypairB);
    await transferSol(keypairA, keypairB.publicKey);
}

accountsScript()
