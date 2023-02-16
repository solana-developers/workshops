# A Tug of War game using Solana Pay QRCodes
# ______o---|---o_____

(For infos on how to start and build see the other readme in next folder)

## 🎬 Recorded Sessions

| Link                                                                                                                                   | Instructor      | Type            |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------- |
| [ To be done | Jonas Hhan | Twitch stream |

## Controling a game on a big screen using Solana Pay QR codes? How?!

<img width="1325" alt="image" src="https://user-images.githubusercontent.com/5938789/218829341-ac942433-cb12-4d97-8164-cb7dbfeffb3d.png">

Solana Pay is usually used the request a vertain amount of tokens or Sol from someone via a Qr code. 
But the transaction request can actually be used for any transaction that you can imagine. So what we build here in this workshop is an interface for a game using Solana Pay Qr codes. When the player scans one fo the codes with his phone his mobile wallet will open an he will be able to sign a transaction. 
In this transaction we put an instruction of an anchor program which will change a number in an account. 
If the player pulls right the value will be increased if he pulls left it will be decreased. 
To this account we then subscribe via websocket connection with the function accountSubscribe, this will push the newest state to the client as soon as it changes.
We then show this number as a nice ascii art tug of war game: 

___Ooo-------|-------oOO_________________

Then when one team reaches the end they will win and the game can be restarted. 
\o/

This could be played on big screens on conferences for example. 

If you want to take it further, there would be the option to deposit some sol into a PDA everytime a player pulls the rope and then in the end the rewars could be payed out to the 
players of the winning team. 

Another usecase would be to have a quiz where multiple parties compete like in You Dont Knoe Jack for example. 
I would love to see someone build this!  
