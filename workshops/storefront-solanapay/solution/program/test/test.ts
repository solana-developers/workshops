import {
    Connection,
    Keypair,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';
import * as borsh from "borsh";
import { Buffer } from "buffer";


function loadKeypairFromFile(path: string): Keypair {
    return Keypair.fromSecretKey(
        Buffer.from(JSON.parse(require('fs').readFileSync(path, "utf-8")))
    )
};

class Assignable {
    constructor(properties) {
        Object.keys(properties).map((key) => {
            return (this[key] = properties[key]);
        });
    };
};

class PizzaOrder extends Assignable {
    toBuffer() { return Buffer.from(borsh.serialize(PizzaOrderSchema, this)) }
    
    static fromBuffer(buffer: Buffer) {
        return borsh.deserialize(PizzaOrderSchema, PizzaOrder, buffer);
    };
};
const PizzaOrderSchema = new Map([
    [ PizzaOrder, { 
        kind: 'struct', 
        fields: [ 
            ['pepperoni', 'u8'], 
            ['mushrooms', 'u8'], 
            ['olives', 'u8'], 
        ],
    }]
]);


describe("Account Data!", () => {

    const connection = new Connection(`https://api.devnet.solana.com`, 'confirmed');
    const payer = loadKeypairFromFile(require('os').homedir() + '/.config/solana/id.json');
    const program = loadKeypairFromFile('./program/target/deploy/pizza_program-keypair.json');

    const pizzaOrderKeypair = Keypair.generate();

    it("Create a pizza order", async () => {
        console.log(`Payer Address      : ${payer.publicKey}`);
        console.log(`Address Info Acct  : ${pizzaOrderKeypair.publicKey}`);
        let ix = new TransactionInstruction({
            keys: [
                {pubkey: pizzaOrderKeypair.publicKey, isSigner: true, isWritable: true},
                {pubkey: payer.publicKey, isSigner: true, isWritable: true},
                {pubkey: SystemProgram.programId, isSigner: false, isWritable: false}
            ],
            programId: program.publicKey,
            data: (
                new PizzaOrder({
                    pepperoni: 2,
                    mushrooms: 3,
                    olives: 1,
                })
            ).toBuffer(),
        });
        await sendAndConfirmTransaction(
            connection, 
            new Transaction().add(ix),
            [payer, pizzaOrderKeypair]
        );
    });

    it("Read the new account's data", async () => {
        const accountInfo = await connection.getAccountInfo(pizzaOrderKeypair.publicKey);
        const readPizzaOrder = PizzaOrder.fromBuffer(accountInfo.data);
        console.log(`Pepperoni      : ${readPizzaOrder.pepperoni}`);
        console.log(`Mushrooms      : ${readPizzaOrder.mushrooms}`);
        console.log(`Olives         : ${readPizzaOrder.olives}`);
    });
});