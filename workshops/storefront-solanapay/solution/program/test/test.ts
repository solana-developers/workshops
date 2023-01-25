import {
    Keypair,
    sendAndConfirmTransaction,
    Transaction,
    TransactionMessage,
    VersionedTransaction,
} from '@solana/web3.js';
import { Buffer } from "buffer";
import { CONNECTION } from '../../src/util/const';
import { createWriteOrderInstruction, getOrderPublicKey, PizzaOrder } from '../../src/util/order';


function loadKeypairFromFile(path: string): Keypair {
    return Keypair.fromSecretKey(
        Buffer.from(JSON.parse(require('fs').readFileSync(path, "utf-8")))
    )
};


describe("Pizza Time!", () => {

    const payer = loadKeypairFromFile(require('os').homedir() + '/.config/solana/id.json');
    const order = 1 + Math.floor(Math.random() * 254);

    it("Create a pizza order", async () => {
        
        console.log(`Order Number       : ${order}`);
        console.log(`Order PublicKey    : ${getOrderPublicKey(order, payer.publicKey)}`);
        console.log(`Payer Address      : ${payer.publicKey}`);

        // let blockhash = await CONNECTION
        //     .getLatestBlockhash()
        //     .then((res) => res.blockhash)
    
        // const messageV0 = new TransactionMessage({
        //     payerKey: payer.publicKey,
        //     recentBlockhash: blockhash,
        //     instructions: [await createWriteOrderInstruction(payer.publicKey, new PizzaOrder({
        //         order,
        //         pepperoni: 2,
        //         mushrooms: 1,
        //         olives: 3,
        //     }))],
        // }).compileToV0Message()
        
        // const tx = new VersionedTransaction(messageV0)
        // tx.sign([payer])

        // const sx = await CONNECTION.sendTransaction(tx, {skipPreflight: true});

        // await CONNECTION.confirmTransaction(sx);

        const sx = await sendAndConfirmTransaction(
            CONNECTION, 
            new Transaction().add(await createWriteOrderInstruction(payer.publicKey, new PizzaOrder({
                order,
                pepperoni: 2,
                mushrooms: 1,
                olives: 3,
            }))),
            [payer],
            { skipPreflight: true }
        );
        await CONNECTION.confirmTransaction(sx);
    });

    it("Read the new account's data", async () => {
        const accountInfo = await CONNECTION.getAccountInfo(getOrderPublicKey(order, payer.publicKey));
        const readPizzaOrder = PizzaOrder.fromBuffer(accountInfo.data);
        console.log(`Pepperoni      : ${readPizzaOrder.pepperoni}`);
        console.log(`Mushrooms      : ${readPizzaOrder.mushrooms}`);
        console.log(`Olives         : ${readPizzaOrder.olives}`);
    });
});