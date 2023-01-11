# Beginner Crash Course

## 🎬 Recorded Sessions
| Link | Instructor | Event |
| ---- | ---------- | ----- |
| [<img src="../../.docs/youtube-icon.png" alt="youtube" width="20" align="center"/>](https://github.com/solana-developers) | Coming soon! | Coming soon! |

## 📗 Learn

We're going to cover the basics of Solana development to get you started building on Solana.   
   
We'll cover the following concepts:
* Keypairs
* The System Program
* Connections:
    * Interacting with the Solana cluster using RPC
    * Sending instructions to Solana via Transactions

### 🔑 [Keypairs](https://solanacookbook.com/references/keypairs-and-wallets.html#how-to-generate-a-new-keypair)
Solana wallets are like other crypto wallets - they utilize a **public key** and **private key**.   
   
**Private keys** are used to sign transactions, which can only be decrypted by that private key's **associated public key**.   
This allows cryptographic programs to verify a signature with only the public key, not the private key.   
This is similar to how SSH keys work in computer communication.   

Solana's SDK can create a keypair compatible with Solana's blockchain, but it's not actually activated until the public key is registered with Solana's **System Program**.

### ⚙️ [The System Program](https://docs.solana.com/developing/runtime-facilities/programs)
Solana has a number of native programs (or smart contracts) that live on it's cluster.   
Arguably the most important native program is the **System Program** - which is responsible for the following:
* Registering public keys as blockchain addresses
* Allocating space at a particular address
* Changing the ownership of an account
   
To register a public key with Solana, we must use the System Program. This will effectively register our keypair's public key as an **address** and create an **account** on Solana's blockchain. The account's address will mark the specific location of our account on Solana's blockchain.   
   
🔸 Here's what registering a keypair's public key with the System Program looks like in TypeScript:   
https://github.com/solana-developers/workshops/blob/33ee92c20f4a15e0f8da3d16708a49a16ac8bb10/workshops/beginner-crash-course/client-examples/scripts/accounts.ts#L36-L58

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

### 🖲️ [Transacting with Solana's Network](https://docs.solana.com/developing/programming-model/transactions)

In order to conduct operations on Solana, you need to use a networking protocol known as RPC to send requests to the cluster.   
   
RPC is similar to HTTP in the sense that you are basically sending a GET or POST request to the Solana network to conduct some sort of business.   
   
**→ Requesting Data from Solana**   
To query state information on Solana without making changes, you can send an RPC request to recieve a certain response with your desired information.   
   
You can do this by setting up a connection to the Solana network, and sending a request.   
   
🔸 Here's what that looks like in TypeScript - where we're requesting information about an account:   
https://github.com/solana-developers/workshops/blob/33ee92c20f4a15e0f8da3d16708a49a16ac8bb10/workshops/beginner-crash-course/client-examples/scripts/accounts.ts#L60-L64
   
**→ Modifying Data on Solana**   
To modify state on Solana, you can also send an RPC request, but you'll need to package this request into what's called a Transaction.   
   
Transactions are structured data payloads that can be signed by a keypair's private key - which allows for cryptographic authentication as we described above.   
   
A transaction looks like this:
```TypeScript
{
    signatures: [ s, s ]            // List of signatures
    message:
        header: 000
        addresses: [ aaa, aaa ]     // Accounts involved in the transaction
        recent_blockhash: int       // The recent blockhash tied to this transaction
        instructions: [ ix, ix ]    // The instructions to perform on Solana's state
}
```
You can see transactions have a list of instructions. These instructions point to specific Solana programs and tell them what to do.   
   
A transaction instruction looks like this:
```TypeScript
{
    program_id: xxx             // The Solana program this instruction is targeting
    accounts: [ aaa, aaa ]      // The accounts involved in this instruction
    instruction_data: b[]       // The specific data that tells the program which operation to conduct
}
```
   
**Note:** A **recent blockhash** is included in Solana transactions as a security measure. Basically, the network is going to make sure this isn't an old transaction to prevent against fraud or hacks.   
   
🔸 Here's an example of sending a transaction in TypeScript - where we're going to transfer some SOL out of our account:   
https://github.com/solana-developers/workshops/blob/33ee92c20f4a15e0f8da3d16708a49a16ac8bb10/workshops/beginner-crash-course/client-examples/scripts/accounts.ts#L66-L90

### 🪙 [Tokens](https://solanacookbook.com/references/token.html)
Tokens on Solana are called SPL Tokens, and they follow a standard just like tokens on Ethereum.   
   
On Solana, tokens are managed like so:
* A Mint account is an account representing the token itself.
* Associated Token Accounts are accounts that tie a wallet address to a mint address and describe that wallet's balance of that mint.
* Metadata accounts are separate accounts that point to the Mint account and define all of the associated metadata for a token.
   
All tokens are managed by the **Token Program** - another native Solana program in charge of SPL tokens.   
   
For working with SPL tokens in TypeScript, we use the following library:   
```json
{
    "dependencies": {
        "@solana/spl-token": "^0.3.7",
    }
}
```
   
🔸 Here's what creating a Mint looks like with the Token Program:   
https://github.com/solana-developers/workshops/blob/cffc4ce2945ad5528d9b2704f81d6f64d030c76a/workshops/beginner-crash-course/client-examples/scripts/tokens.ts#L81-L113
   
**→ Mint Accounts**   
A Mint account contains standard data about a particular token mint:
```TypeScript
{
    isInitialized,
    supply,             // The current supply of this token mint on Solana
    decimals,           // The number of decimals this mint breaks down to
    mintAuthority,      // The account who can authorize minting of new tokens
    freezeAuthority,    // The account who can authorize freezing of tokens
}
```

**→ Decimals**   
A Mint's decimals define how the token's supply is broken up.   
   
For example, for a Mint whose decimals value is set to 3, if you send 5 tokens to someone, they will actually be receiving 0.005 tokens.   
   
Calculation: `quantity * 10 ^ (-1 * d)` where d = decimals.   
   
The standard for SPL Tokens on Solana is 9 decimals, but you can specify any decimal value you want.   
   
NFTs have a decimal value of 0. More on this later.   
   
**→ Mint Authority**   
The **Mint Authority** is the account that is allowed to create (mint) new tokens.   
   
The Token Program does the actual minting of new tokens, but it's only authorized to do so if the Mint's specified Mint Authority has signed the transaction.   
   
When a Mint Authority is set to `None`, that means no more new tokens can be minted. This action is irreversible.   
   
**→ Freeze Authority**   
The **Freeze Authority** is the account that is allowed to freeze token movement.   
   
This means that a "freeze" is placed on the Mint, and no transfers amongst any Associated Token Accounts regarding that Mint can be conducted.   
   
When a Freeze Authority is set to `None`, that means this token cannot be frozen. This action is irreversible.   
   

**→ Associated Token Accounts**   
Associated Token Accounts are accounts designed to describe how many tokens a particular wallet holds.   
   
Since Solana accounts only have a default field for Lamports, and many different kinds of SPL tokens can be created by anyone, it's impossible to include a field for every possible SPL token in an account.   
   
Instead, we make use of separate accounts - called Associated Token Accounts - to keep track of a wallet's balance of a particular token.   
   
These accounts essentially have 2 pointers - the wallet it's associated with and the Mint it's associated with - and a balance.   
   
🔸 Here's what minting tokens to an Associated Token Account looks like in TypeScript:   
https://github.com/solana-developers/workshops/blob/cffc4ce2945ad5528d9b2704f81d6f64d030c76a/workshops/beginner-crash-course/client-examples/scripts/tokens.ts#L115-L160
   
🔸 Here's what transferring tokens between Associated Token Accounts looks like in TypeScript:   
https://github.com/solana-developers/workshops/blob/cffc4ce2945ad5528d9b2704f81d6f64d030c76a/workshops/beginner-crash-course/client-examples/scripts/tokens.ts#L162-L202
   
**→ Metadata**   
We must create a separate metadata account that points to our mint to give our token metadata - such as an image.   
   
For this, we use the library for **Metaplex Token Metadata** - the standard for SPL Token metadata on Solana:   
```json
{
    "dependencies": {
        "@metaplex-foundation/mpl-token-metadata": "^2.5.2",
    }
}
```
   
Metaplex's SDK will let us use helper methods to create the necessary instructions, which will target the Metaplex Token Metadata Program.   

🔸 Here's where we create the instruction for creating this metadata account, using Metaplex's data types:   
https://github.com/solana-developers/workshops/blob/62ede19d9d0be5bbe290d9e4106be2f82a6b5846/workshops/beginner-crash-course/client-examples/scripts/tokens.ts#L104-L127

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