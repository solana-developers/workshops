# NFT Minter

## 🎬 Recorded Sessions
| Link | Instructor | Event |
| ---- | ---------- | ----- |
| [<img src="../../.docs/youtube-icon.png" alt="youtube" width="20" align="center"/>](https://github.com/solana-developers) | Coming soon! | Coming soon! |

## 📗 Learn

This workshop makes use of the brand-new Metaplex JS library to create & mint an NFT to our user with a custom photo they've uploaded!   
   
There are several key takeaways from this workshop:
* [Solana dApp Scaffold](#solana-dapp-scaffold)
* [Wallet Adapter](#wallet-adapter)
* [Metaplex JS Metadata & Bundlr Support](#metaplex-js-metadata--bundlr-support)
* [Metaplex JS Create & Mint NFT](#metaplex-js-create--mint-nft)

### Solana dApp Scaffold
This workshop is built using a repository template known as a dApp Scaffold.   
   
A dApp Scaffold is a boilerplate repo consisting of all of the basic requirements to build a Solana dApp.   
These include:
* Wallet Adapter Context
* Wallet Adapter Multi-Button
    * With integrated support for mulitple popular Solana wallets
* Airdrop functionality
* Basic file directory layout
* Customizable theme & colors
* And more! (Docker, etc.)

This particular Scaffold is built for Next JS, but you can find all scaffolds here:
* [dApp Scaffold Next](https://github.com/solana-labs/dapp-scaffold)
* [dApp Scaffold React Native](https://github.com/solana-developers/dapp-scaffold-react-native)
* [dApp Scaffold Vue](https://github.com/solana-developers/dapp-scaffold-vue)
* [dApp Scaffold Svelte](https://github.com/solana-developers/dapp-scaffold-svelte)

Or you can use the command:
```shell
npx create-solana-dapp <dapp-name>
```

### Wallet Adapter
The wallet adapter is just what it sounds like: it's an adapter for integrating wallet support for various Solana wallets.   
   
The out-of-the-box integrations:
* React Context for wallet connections
    * This means your app can leverage the `useWallet` hook to reference the user's connected wallet in any component.
    * Your app's components are wrapped inside of the `WalletContext`, allowing this hook to be accessible anywhere.
* Support for multiple wallets - such as Phantom, Solflare, and Glow
* An interactive "Connect Wallet" button for handling wallet connections
* The `useWallet` hook also provides a handful of transaction and connection methods, including `sendTransaction` and `publicKey`

You can find the Wallet Adapter source code [here](https://github.com/solana-labs/wallet-adapter).

### Metaplex JS Metadata & Bundlr Support
The Metaplex JS library has added support for Bundlr, which gives you an easy way to host metadata that your on-chain Metadata account can point to.   
   
More specifically, the library uses Bundlr to host the JSON file that defines your NFT's metadata, and provides you with a `uri` to write to your on-chain Metadata.   
   
This can be done with one simple method call!

### Metaplex JS Create & Mint NFT
The Metaplex JS library also has a new, more concise way to mint NFTs.   
   
You can create an NFT and in the same function choose to mint 1 of this NFT to your user's connected wallet.

The Metaplex JS library can be found [here on NPM](https://www.npmjs.com/package/@metaplex-foundation/js) and [here in GitHub](https://github.com/metaplex-foundation/js).