import { getAssociatedTokenAddress, getAccount, getMint, createTransferCheckedInstruction, createAssociatedTokenAccountInstruction, getAssociatedTokenAddressSync, transfer } from "@solana/spl-token";
import { SystemProgram, LAMPORTS_PER_SOL, PublicKey, TransactionInstruction, Connection } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { MERCHANT_WALLET } from "./const";


export const transferSolInstruction = async (
    sender: PublicKey, 
    reference: PublicKey, 
    amount: number
) => {
    const solTransfer = SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: MERCHANT_WALLET,
        lamports: Number(amount) * LAMPORTS_PER_SOL,
    });
    solTransfer.keys.push({
        pubkey: new PublicKey(reference),
        isSigner: false,
        isWritable: false,
    });
    return solTransfer;
} 

const transferSplTokenInstruction = async (
    connection: Connection,
    sender: PublicKey,
    reference: PublicKey,
    token: string,
    amount: number,
) => {
    
    const senderInfo = await connection.getAccountInfo(sender);
    if (!senderInfo) throw new Error('sender not found');
    const splToken = new PublicKey(token);

    // Get the sender's ATA and check that the account exists and can send tokens
    const senderATA = await getAssociatedTokenAddress(splToken, sender);
    const senderAccount = await getAccount(connection, senderATA);
    if (!senderAccount.isInitialized) throw new Error('sender not initialized');
    if (senderAccount.isFrozen) throw new Error('sender frozen');

    // Get the merchant's ATA and check that the account exists and can receive tokens
    const merchantATA = await getAssociatedTokenAddress(
        splToken,
        MERCHANT_WALLET
    );
    const merchantAccount = await getAccount(connection, merchantATA);
    if (!merchantAccount.isInitialized) throw new Error('merchant not initialized');
    if (merchantAccount.isFrozen) throw new Error('merchant frozen');

    // Check that the token provided is an initialized mint
    const mint = await getMint(connection, splToken);
    if (!mint.isInitialized) throw new Error('mint not initialized');
    let transferAmount = BigNumber(amount)
        .times(BigNumber(10).pow(mint.decimals))
        .integerValue(BigNumber.ROUND_FLOOR);
    const tokens = BigInt(String(transferAmount));
    if (tokens > senderAccount.amount) console.log('ggs bad code');

    // Create an instruction to transfer SPL tokens, asserting the mint and decimals match
    const splTransferIx = createTransferCheckedInstruction(
        senderATA,
        splToken,
        merchantATA,
        sender,
        tokens,
        mint.decimals
    );

    splTransferIx.keys.push({
        pubkey: new PublicKey(reference),
        isSigner: false,
        isWritable: false,
    });

    return splTransferIx;
} 

// Create the token transfer instruction
export const createTransferTokenInstruction = async (
    connection: Connection,
    sender: PublicKey,
    reference: PublicKey,
    token: string,
    amount: number,
) => token === 'SOL' ? 
    transferSolInstruction(
        sender,
        reference,
        amount,
    ) 
    : 
    transferSplTokenInstruction(
        connection,
        sender,
        reference,
        token,
        amount,
    )
