import {
    it,
    describe,
} from 'mocha'
import {
    Connection,
    Keypair,
    sendAndConfirmTransaction,
    Transaction,
} from '@solana/web3.js'
import { createSayGoodbyeInstruction, createSayHelloInstruction } from './instructions'


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

        let ix = createSayHelloInstruction(
            payer.publicKey,
            program.publicKey,
            "Hello, World!",
        )

        await sendAndConfirmTransaction(
            connection, 
            new Transaction().add(ix),
            [payer]
        )
    })

    it("Say goodbye!", async () => {

        let ix = createSayGoodbyeInstruction(
            payer.publicKey,
            program.publicKey,
            "Goodbye, World!",
            "See You Next Time!",
        )

        await sendAndConfirmTransaction(
            connection, 
            new Transaction().add(ix),
            [payer]
        )
    })
  })
  