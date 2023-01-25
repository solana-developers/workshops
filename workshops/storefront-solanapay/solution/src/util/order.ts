import { TransactionInstruction, SystemProgram, PublicKey, Connection } from "@solana/web3.js";
import * as borsh from "borsh";
import { Buffer } from "buffer";
import { PIZZA_PROGRAM_ID } from "./const";


export class PizzaOrder {

    order: number;
    pepperoni: number;
    mushrooms: number;
    olives: number;

    constructor(props: {
        order: number,
        pepperoni: number,
        mushrooms: number,
        olives: number,
    }) {
        this.order = props.order;
        this.pepperoni = props.pepperoni;
        this.mushrooms = props.mushrooms;
        this.olives = props.olives;
    }

    toBuffer() { return Buffer.from(borsh.serialize(PizzaOrderSchema, this)) }
    
    static fromBuffer(buffer: Buffer) {
        return borsh.deserialize(PizzaOrderSchema, PizzaOrder, buffer);
    };
};
const PizzaOrderSchema = new Map([
    [ PizzaOrder, { 
        kind: 'struct', 
        fields: [ 
            ['order', 'u8'], 
            ['pepperoni', 'u8'], 
            ['mushrooms', 'u8'], 
            ['olives', 'u8'], 
        ],
    }]
]);

export const getOrderPublicKey = (orderNumber: number, payer: PublicKey) => PublicKey.findProgramAddressSync(
    [
        Buffer.from("solami_pizza"),
        Buffer.from(Uint8Array.of(orderNumber)),
        payer.toBuffer(),
    ],
    PIZZA_PROGRAM_ID,
)[0];

// Create the write-order instruction (our custom program)
export const createWriteOrderInstruction = async (
    payer: PublicKey,
    pizzaOrder: PizzaOrder,
) => new TransactionInstruction({
        keys: [
            {pubkey: getOrderPublicKey(pizzaOrder.order, payer), isSigner: false, isWritable: true},
            {pubkey: payer, isSigner: true, isWritable: true},
            {pubkey: SystemProgram.programId, isSigner: false, isWritable: false}
        ],
        programId: PIZZA_PROGRAM_ID,
        data: pizzaOrder.toBuffer(),
    });

// Display the order details from the on-chain data
export const displayOnChainPizzaOrder = async (
    connection: Connection,
    orderPublicKey: PublicKey,
) => {
    const accountInfo = await connection.getAccountInfo(orderPublicKey);
    if (!accountInfo) throw('Account data not found.')
    return PizzaOrder.fromBuffer(accountInfo.data);
}