import { Account, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { 
    AccountInfo,
    Connection, 
    Keypair, 
    LAMPORTS_PER_SOL, 
    PublicKey 
} from "@solana/web3.js"

export function newLogSection() {
    console.log("-----------------------------------------------------")
}

export async function logAccountInfo(accountInfo: AccountInfo<Buffer> | null) {
    console.log("Account Info:")
    console.log(accountInfo)
}

export function logNewKeypair(keypair: Keypair) {
    console.log("Created a new keypair.")
    console.log(`   New account Public Key: ${keypair.publicKey}`);
}

export async function logTransaction(connection: Connection, signature: string) {
    await connection.confirmTransaction(signature)
    console.log("Transaction successful.")
    console.log(`   Transaction signature: ${signature}`);
}

export async function logBalance(accountName: string, connection: Connection, pubkey: PublicKey) {
    const balance = await connection.getBalance(pubkey)
    console.log(`   ${accountName}:`);
    console.log(`       Account Pubkey: ${pubkey.toString()} SOL`);
    console.log(`       Account Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
}

export function logNewMint(mintPubkey: PublicKey, decimals: number) {
    console.log("Created a new mint.")
    console.log(`   New mint Public Key: ${mintPubkey}`);
    console.log(`   Mint type: ${decimals === 0 ? 'NFT' : 'SPL Token'}`);
}

export async function logTokenBalance(accountName: string, associatedTokenAccount: Account) {
    console.log(`   ${accountName}:`);
    console.log(`       ATA Pubkey      : ${associatedTokenAccount.address}`);
    console.log(`       Mint            : ${associatedTokenAccount.mint}`);
    console.log(`       Token Balance   : ${associatedTokenAccount.amount}`);
}