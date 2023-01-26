import {
    it,
    describe,
} from 'mocha'
import {
    Connection,
    Keypair,
    PublicKey,
    sendAndConfirmTransaction,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js'


function loadKeypairFromFile(path: string): Keypair {
    return Keypair.fromSecretKey(
        Buffer.from(JSON.parse(require('fs').readFileSync(path, "utf-8")))
    )
}


describe("hello-solana", () => {

    const connection = new Connection(`https://api.devnet.solana.com`, 'confirmed')
    const payer = loadKeypairFromFile(require('os').homedir() + '/.config/solana/id.json')
    const program = loadKeypairFromFile('./program/target/deploy/program-keypair.json')
  
    it("Say hello!", async () => {

        // Build a transaction with an instruction that will invoke our program.
    })
  })
  