import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { TugOfWar } from "../target/types/tug_of_war";

describe("tug-of-war", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TugOfWar as Program<TugOfWar>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
