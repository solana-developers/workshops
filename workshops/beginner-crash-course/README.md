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
   
🔸 Here's what registering a keypair's public key with the System Program looks like in JavaScript:   
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
   
🔸 Here's what that looks like in JavaScript - where we're requesting information about an account:   
https://github.com/solana-developers/workshops/blob/33ee92c20f4a15e0f8da3d16708a49a16ac8bb10/workshops/beginner-crash-course/client-examples/scripts/accounts.ts#L60-L64
   
**→ Modifying Data on Solana**   
To modify state on Solana, you can also send an RPC request, but you'll need to package this request into what's called a Transaction.   
   
Transactions are structured data payloads that can be signed by a keypair's private key - which allows for cryptographic authentication as we described above.   
   
A transaction looks like this:
```javascript
{
    signatures: [ s, s ]            // List of signatures
    message:
        header: 000
        addresses: [ aaa, aaa ]     // Accounts involved in the transaction
        recent_blockhash: int       // The recent blockhash tied to this transaction
        instructions: [ ix, ix ]    // The instructions to perform on Solana's state
}
```
   
**Note:** A **recent blockhash** is included in Solana transactions as a security measure. Basically, the network is going to make sure this isn't an old transaction to prevent against fraud or hacks.   
   
🔸 Here's an example of sending a transaction in JavaScript - where we're going to transfer some SOL out of our account:   
https://github.com/solana-developers/workshops/blob/33ee92c20f4a15e0f8da3d16708a49a16ac8bb10/workshops/beginner-crash-course/client-examples/scripts/accounts.ts#L66-L90

### 🪙 [Tokens](https://solanacookbook.com/references/token.html)
**→ SPL**   
**→ Associated Token Accounts**   
**→ Metadata**   

### 📝 [Writing Programs](https://solanacookbook.com/references/programs.html#how-to-transfer-sol-in-a-program)
**→ Program Structure**   
**→ Deserializing Instructions**   
**→ Sending Transactions to Your Program**   
**→ Serializing Data**   
**→ Building Custom Instructions**   