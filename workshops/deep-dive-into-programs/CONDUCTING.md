# How to Conduct This Workshop

### [<img src="../../.docs/youtube-icon.png" alt="youtube" width="20" align="center"/> Video Tutorial](https://www.youtube.com/watch?v=u1HyjeBs3xk)

### 📋 Step-By-Step Tutorial

At the end of this workshop session, the participants will ship their own Solana program.   
   
There's a small React app inside the `app` folder.   
This running app allows anyone to plug in their deployed Program ID and attempt to perform the action.   
If it works, the program was written correctly.   
   
**→ Hosting the Solution React App:**   
You can choose how you want to make this app accessible to your participants:
* You can run it locally on your machine and punch in people's Program ID yourself
* You can allow tunnel access to your local port via `ngrok` (`ngrok http 3000`)
* You can host the Solution React App on a hosting server such as Vercel
   
Regardless of how you accomplish this, as long as this app is running somewhere, all you have to do is request the participants deploy a program to the network of your choice (`devnet` | `testnet` | `mainnet`) and ensure the network inside of the `src/lib/const.ts` matches!