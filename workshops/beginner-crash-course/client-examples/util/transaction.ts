import { 
    Connection, 
    Keypair, 
    PublicKey, 
    TransactionInstruction, 
    TransactionMessage, 
    VersionedTransaction 
} from "@solana/web3.js"


export async function buildTransaction(
    connection: Connection,
    payer: PublicKey,
    signers: Keypair[],
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
    
    signers.forEach(s => tx.sign([s]))

    return tx
}