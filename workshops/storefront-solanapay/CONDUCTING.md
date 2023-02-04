# How to Conduct This Workshop

Participants do not need to have Solana installed to participate in this workshop. They need only Node JS.

### **Step 1** (`starter`): Add a Solana Pay QR for transferring SOL

We start with the shell of the UI - a Pizza storefront where you can add ingredients to your pizza.   
   
The section for the QR code is rendered, but the QR code doesn't come with it yet.   
   
We go from having no Solana Pay imports/code whatsoever to having a working SOL transfer QR code.

### **Step 2** (`step-1`): Implement other SPL tokens to the transaction

Now that we have a working QR code that can do a transfer of SOL, we can start to build on our transaction.   
   
We'll go ahead and add support for two SPL tokens, whose mint addresses are hard-coded in the source, and below:
* Simulated USDC: `EvLepoDXhscvLxbTQ7byj3NE6n6gSNJP3DeZx5k49uLm`
* Simulated BONK: `EvLepoDXhscvLxbTQ7byj3NE6n6gSNJP3DeZx5k49uLm`

### **Step 3** (`step-2`): Implement a custom program instruction to the transaction

Now that we've got multiple tokens and a new token transfer instruction included in our transaction, we can now add custom program instructions as well!   
   
We'll do exactly that in this step: Add the custom instruction to write the Pizza Order to the chain. 

### **Step 4** (`solution`): You made it!