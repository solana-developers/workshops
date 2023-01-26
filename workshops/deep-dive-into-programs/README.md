# Deep Dive into Writing Solana Programs

## 🎬 Recorded Sessions
| Link | Instructor | Event |
| ---- | ---------- | ----- |
| [<img src="../../.docs/youtube-icon.png" alt="youtube" width="20" align="center"/>](https://github.com/solana-developers) | Coming soon! | Coming soon! |

## 📗 Learn

Let's dive deep into writing smart contracts (or programs) on Solana.   
   
We'll cover the following concepts:
* [Accounts](#📂-accountshttpssolanacookbookcomcore-conceptsaccountshtmlfacts)
    * Rent
    * Executable Accounts
    * Data
    * Ownership
* [Writing Programs](#📝-writing-programshttpssolanacookbookcomreferencesprogramshtmlhow-to-transfer-sol-in-a-program)
    * Program Structure
    * Building Custom Instructions for Your Program
    * Building Custom Instructions on the Client-Side
    * Frameworks for Writing Solana Programs
* [Tokens](#🪙-tokenshttpssolanacookbookcomreferencestokenhtml)
    * Mint Accounts
    * Decimals
    * Mint Authority
    * Freeze Authority
    * Associated Token Accounts
    * Metadata

### 📂 [Accounts](https://solanacookbook.com/core-concepts/accounts.html#facts)
You can think of Solana's global state as an operating system. In Linux, it's known that "everything is a file". You can swap the word "account" for "file" when talking about Solana, and majority of the concepts will be the same.   
   
In an nutshell, Solana indexes data - including someone's balance of SOL - into accounts on the blockchain, and can find them using their address.   
   
Accounts follow a basic structure:
```text
{
    lamports:   The amount of SOL (Lamports) in an account
    owner:      The program that owns this account
    executable: Whether or not this account is an executable program
    data:       The custom data stored within this account
    rentEpoch:  The next epoch that rent will be due for this account
}
```
   
You can see, by default, accounts store some metadata - including a balance of SOL (Lamports).   
   
**→ Rent**   
Solana charges a user **rent** for storing data on the blockchain - even if it's just the default metadata. The more data you add to the `data` field, the more rent you will be responsible for paying.   
This is due to the simple fact that Solana cluster nodes pay for hardware, which is where your data will be stored. This distributes the cost across the cluster similar to a market.   
**Note:** You can make an account rent-exempt by depositing a SOL (Lamports) value equivalent to 2 year's worth of rent. This will effectively halt rent withdrawals on your account and leave your balance in tact.   
   
It's worth noting that the amount you pay in rent is almost negligible for most accounts.   
   
**→ Executable Accounts**   
Simply put, everything on Solana is an account, even smart contracts.   
   
Smart contracts (Programs) live inside of accounts, and in order to tell the cluster that an account is actually an executable program, the boolean `executable` is used.   
   
**→ Data**   
The `data` field is called an account's "inner data" and that's where you can store your own custom data.   
   
This data is stored in the form of bytes, and you need to serialize traditional data into bytes in order to store it inside an account.   
   
More on this later.   
   
**→ Ownership**   
Ownership is an extremely important concept in Solana.   
Basically, every account is owned by a program. When a program owns an account, it's allowed to modify it's data at will.   
   
Programs like the System Program have signature requirements that prevent unwanted changes to an account.
> Think about it: Can anyone withdraw SOL from your wallet without your permission? No!   
> You have to sign any transaction with your private key that will **debit** lamports from your account.   
> However, anyone can **credit** your account (add funds), because, why wouldn't you want free money?   
> This is how airdrops work.   

⚠️ If you write your own program and create accounts that are owned by your program, your program can modify those accounts - including debit their SOL balances - without permission.

### 📝 [Writing Programs](https://solanacookbook.com/references/programs.html#how-to-transfer-sol-in-a-program)
Most Solana operations can be done without writing your own program. In fact, many popular dApps on Solana simply leverage the client-side RPC interactions with the Solana network and don't utilize a custom program.   
   
However, you may find the need to write your own program for many reasons.   
   
When writing your own program, there are a few things to understand:
* The structure of a Solana program
* How to set up multiple instructions
* How to serialize your program's instructions from the client side
* How to send a transaction to your custom program
   
Solana programs are written in Rust, and leverage the `solana-program` crate, as well as many others including `spl-token` - depending on what your program does.   
   
**→ Program Structure**   
All Solana programs - whether they are custom programs or native programs - follow the same structure.   

Programs have an **entrypoint** - which tells the Solana runtime where the entrypoint to this program is. The entrypoint is simply the function that has been specifically designed to process a Transaction Instruction.   

If you look at the anatomy of a Transaction Instruction above - under [Transacting with Solana's Network](#🖲️-transacting-with-solanas-networkhttpsdocssolanacomdevelopingprogramming-modeltransactions) - you can see why a Solana program's entrypoint must look like this:
```rust
fn my_program(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult
```
   
🔸 Here's a simple Solana program demonstrating this entrypoint in action:   
https://github.com/solana-developers/workshops/blob/b1cb19170da82bf59f57c4b646b6612c4501d8ec/workshops/beginner-crash-course/hello-world/program/src/lib.rs#L1-L31
   
Solana programs written in Rust must be of crate type `lib` and declare a specific lib type known as `cdylib`.   
You can specify this configuration in the `Cargo.toml` file like so:
```toml
[lib]
crate-type = ["cdylib", "lib"]
```
   
**→ Building Custom Instructions for Your Program**   
The `instruction_data` field within a transaction instruction is the data that you can use to tell your program which operation to conduct.   
   
You can define custom instruction payloads in Rust using structs, and use an enum to match against the various structs you've defined.   
To do this, you need to leverage the `borsh` and `borsh-derive` crates to allow Rust to deserialize these objects from the instruction payload.   
   
🔸 Here's an example of using such structs and an enum to create instructions:   
https://github.com/solana-developers/workshops/blob/5e7288353b9a716415ff9d558b8248d806a978f6/workshops/beginner-crash-course/hello-world-again/program/src/lib.rs#L11-L26
   
🔸 Here's a more built-out Solana program demonstrating instruction processing:   
https://github.com/solana-developers/workshops/blob/5e7288353b9a716415ff9d558b8248d806a978f6/workshops/beginner-crash-course/hello-world-again/program/src/lib.rs#L1-L61
   
**→ Building Custom Instructions on the Client-Side**   
On the client side, you have to replicate the structs that you defined on-chain in Rust.   
   
You can do this by again using `borsh` to serialize objects into bytes.   
   
🔸 Here's how to build a schema for matching an instruction struct defined in Rust:   
https://github.com/solana-developers/workshops/blob/701c1df2d4ce16d1543dddfb7f5056114ebe9245/workshops/beginner-crash-course/hello-world-again/tests/instructions.ts#L15-L61
   
🔸 Now here's an example of sending different instructions to our custom program:   
https://github.com/solana-developers/workshops/blob/701c1df2d4ce16d1543dddfb7f5056114ebe9245/workshops/beginner-crash-course/hello-world-again/tests/test.ts#L27-L40
   
**→ Frameworks for Writing Solana Programs**   
* ⚓️ [Anchor](https://www.anchor-lang.com/)
* 🐴 [Seahorse](https://seahorse-lang.org/)
   