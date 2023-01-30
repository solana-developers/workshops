# How to Conduct This Workshop

### [<img src="../../.docs/youtube-icon.png" alt="youtube" width="20" align="center"/> Video Tutorial](https://www.youtube.com/watch?v=u1HyjeBs3xk)

### [<img src="../../.docs/slides-icon.svg" alt="slides" width="20" align="center"/> Presentation Slides](https://docs.google.com/presentation/d/1itl6GW7P8NmpALKKAki5q4FdQp75FNh1/edit?usp=sharing&ouid=110179409255229051861&rtpof=true&sd=true)

## 📋 Step-By-Step Tutorial

First thing's first, make sure people have the proper local configurations:
* 🌐 [NodeJS](https://nodejs.org/en/download/)
* 👾 [Solana](https://docs.solana.com/cli/install-solana-cli-tools)

Optionally, they can have Rust installed, but if not they can use Solana Playground:
* ⚙️ [Rust](https://rustup.rs/)
* 🏖️ [Solana Playground](https://beta.solpg.io/)

Open up the slide deck [linked above](#img-srcdocsslides-iconsvg-altslides-width20-aligncenter-presentation-slideshttpsdocsgooglecompresentationd1itl6gw7p8nmpalkkaki5q4fdqp75fnh1edituspsharingouid110179409255229051861rtpoftruesdtrue) and share your screen.   
   
Open up the source code on-screen - you can either use GitHub or VS Code.   
   
Now step through the workshop's [README](./README.md) and display the slides on-screen.   
   
You'll just want to explain whatever you're covering as you go, and whenever you want to show code flip from the slide deck to the source code.   
   
**→ Running Code Locally:**   
Participants can run the code in the workshop locally, or in Solana Playground by just cloning the code or importing into SolPG.   
   
See [Importing Code from GitHub into SolPG](../../instructors/notes/how-tos.md#importing-code-from-github-into-solpg) in the instructor docs.   
   
### 🏆 Challenges:
* Instructions & Transactions
    * After learning how to conduct a `createAccount` instruction, build a transaction inside the `transfer` function to conduct a transfer of SOL between two parties.
* Writing Programs
    * After learning how to write `hello-world`, build a transaction with an instruction that will invoke our program.
    * After learning how to write `hello-world-again` and serialize our `SayHello` instruction on the client-side, implement the client-side serialization of `SayGoodbye` to build a transaction with an instruction that will invoke our program's `SayGoodbye` operation.
* Tokens
    * AFter learning how to create & mint tokens, build a transaction inside the `transfer` function to conduct a transfer of each type of SPL Token between two parties.