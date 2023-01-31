# A straightforward guide to Solana Pay Transaction Requests 📲
# 🍕 Build a Storefront

## 🎬 Recorded Sessions

| Link                                                                                                                                   | Instructor      | Type            |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------- |
| [<img src="../../.docs/youtube-icon.png" alt="youtube" width="20" align="center"/> Video](https://www.youtube.com/watch?v=FQYmWWw5l04) | Joe Caufield | Hacker House Recording |

## 😍 Why I like Solana Pay, and why you should too.

Solana Pay is freakin amazing. Have you ever scanned a QR Code on PayPal, Cashapp or a Wallet to send some money to your friends and thought "Oh damn this is pretty smooth". Well Solana Pay is gonna blow your mind. But there's two different "features" in [Solana Pay](https://solanapay.com/), let's go into them:
First of all what you should know that Solana Pay is actually a URL that is read by wallets with an end goal of it's user signing a transaction on the Solana network. This URL can be read by a wallet by you scanning a QR Code for example. Let's look at the differences between these URLs.
 - Transfer Requests: A transfer request is pretty easy to understand: it's a transfer request. Let's look at one of these URLs:  `
solana:<recipient>?amount=<amount>&spl-token=<spl-token>&reference=<reference>&label=<label>&message=<message>&memo=<memo>`
It's pretty straightforward, the recipient is the Pubkey of the user getting a certain amount of a certain Token. The reference is a unique key that is used to difference transactions from each other. Imagine a business like amazon that accepts millions of payments per day, they somehow have to track what payment is intended for a certain purchase. That's what the reference key enables, i will give a reference key made to a checkout for a pack of cookies on my website, and as soon as a payment with that reference key is made i will be able to send the person my cookie. 
The other stuff in the URL is pretty useless, it's just gonna show a label/message on the users wallet when they want to sign.

- Transaction Requests: This is where the real magic comes in. The URL would look like this in a transaction request: `solana:https://example.solanapay.com/api/transaction`.
Looks different ? Yes! A wallet will actually go ahead and send a GET and a POST request to this endpoint. The GET request will get the Store's name and image so these can be displayed on the wallet payment screen. The POST request will return a transaction which the wallet will be able to sign. And as a merchant, you are the one creating this transaction. This enables an infinite amount of possibilities. You could offer loyalty coupons to your customer or swap the Tokens you get paid in into USDC automatically for example.

What we are going to look at in this mini course is Transaction Requests because Transfer requests are too basic for us lol.

#