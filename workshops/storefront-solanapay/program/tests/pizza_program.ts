import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import assert from "assert";
import { PizzaProgram } from "../target/types/pizza_program";

describe("pizza_program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.PizzaProgram as Program<PizzaProgram>;

  it("Create a pizza order", async () => {
    const orderNumber = 1 + Math.floor(Math.random() * 254);

    // Generate the pizza order account public key from its seeds
    const [orderPublicKey] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("solami_pizza"),
        Buffer.from(Uint8Array.of(orderNumber)),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    console.log("Order Number: ", orderNumber);
    console.log("Order PublicKey: ", orderPublicKey.toBase58());
    console.log("Payer Address: ", provider.wallet.publicKey.toBase58());

    // Create order
    const pepperoni = 3;
    const mushrooms = 2;
    const olives = 1;
    const transaction = await program.methods
      .createPizzaOrder(orderNumber, pepperoni, mushrooms, olives)
      .accounts({
        payer: provider.wallet.publicKey,
        pizzaOrder: orderPublicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // fetch the account
    const orderAccount = await program.account.pizzaOrder.fetch(orderPublicKey);

    console.log("Order: ", orderAccount.order);
    console.log("Pepperoni: ", orderAccount.pepperoni);
    console.log("Mushrooms: ", orderAccount.mushrooms);
    console.log("Olives: ", orderAccount.olives);

    assert.equal(orderAccount.order, orderNumber);
    assert.equal(orderAccount.pepperoni, pepperoni);
    assert.equal(orderAccount.mushrooms, mushrooms);
    assert.equal(orderAccount.olives, olives);
  });
});
