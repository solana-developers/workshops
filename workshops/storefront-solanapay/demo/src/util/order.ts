import { SystemProgram, PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";
import { CONNECTION, PIZZA_PROGRAM_ID } from "./const";
import { IDL } from "../../src/idl/pizza_program";
import { Program, Provider } from "@coral-xyz/anchor";

export class PizzaOrder {
  order: number;
  pepperoni: number;
  mushrooms: number;
  olives: number;

  constructor(props: {
    order: number;
    pepperoni: number;
    mushrooms: number;
    olives: number;
  }) {
    this.order = props.order;
    this.pepperoni = props.pepperoni;
    this.mushrooms = props.mushrooms;
    this.olives = props.olives;
  }
}

export const getOrderPublicKey = (orderNumber: number, payer: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [
      Buffer.from("solami_pizza"),
      Buffer.from(Uint8Array.of(orderNumber)),
      payer.toBuffer(),
    ],
    PIZZA_PROGRAM_ID
  )[0];

const createProgram = () => {
  // create read-only Provider
  const provider: Provider = {
    connection: CONNECTION,
  };

  return new Program(IDL, PIZZA_PROGRAM_ID, provider);
};

// Create the write-order instruction (our custom program)
export const createWriteOrderInstruction = async (
  payer: PublicKey,
  pizzaOrder: PizzaOrder
) => {
  const program = createProgram();
  return await program.methods
    .createPizzaOrder(
      pizzaOrder.order,
      pizzaOrder.pepperoni,
      pizzaOrder.mushrooms,
      pizzaOrder.olives
    )
    .accounts({
      pizzaOrder: getOrderPublicKey(pizzaOrder.order, payer),
      payer,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
};

// Display the order details from the on-chain data
export const displayOnChainPizzaOrder = async (orderPublicKey: PublicKey) => {
  console.log("displayOnChain...");
  const program = createProgram();
  console.log("got program!");

  try {
    return (await program.account.pizzaOrder.fetch(
      orderPublicKey
    )) as PizzaOrder;
  } catch {
    throw "Account data not found.";
  }
};
