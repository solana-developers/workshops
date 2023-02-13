'use client'; // this makes next know that this page should be rendered in the client
import { useEffect, useState } from 'react';
import { Keypair, PublicKey } from '@solana/web3.js';
import { CONNECTION } from '@/src/util/const';
import { GameDataAccount, displayPlayerPosition, getGameDataAccountPublicKey } from '@/src/util/move';
import QRCode from '@/src/components/QrCodeComp';
import PayQR from '@/src/components/PayQR';

export default function Home() {
  const [gameDataState, setGameDataState] = useState<GameDataAccount>()
  const [reference, setReference] = useState<PublicKey>();
  const [currentPlayerPosition, setCurrentPlayerPosition] = useState<number>();

  useEffect(() => {
    setReference(Keypair.generate().publicKey);

    const asncFunc = async () => {
      const orderPublicKey = getGameDataAccountPublicKey();
      console.log(orderPublicKey);
      const gameData = await displayPlayerPosition(
        CONNECTION,
        orderPublicKey,
      );
      setGameDataState(gameData);
      setCurrentPlayerPosition(gameData.playerPosition);
    };
    console.log("asncFunc");
    asncFunc();

  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const orderPublicKey = getGameDataAccountPublicKey();
      const gameData = await displayPlayerPosition(
        CONNECTION,
        orderPublicKey,
      );
      setGameDataState(gameData);
      setCurrentPlayerPosition(gameData.playerPosition);
    }, 500);
    return () => {
      clearInterval(interval);
    };
  }, [currentPlayerPosition, reference]);

  return (
    <main className='min-h-screen bg-blue-500 p-2'>
      { <div className="w-full min-h-screen bg-no-repeat bg-cover bg-center bg-fixed bg-[url('../public/bg.jpg')]">
        <div className="w-full min-h-screen bg-no-repeat bg-cover bg-center bg-fixed bg-blue-900 bg-opacity-60 pt-4">

          <div className='flex flex-col justify-center'>

            <div className='bg-white shadow-md rounded-2xl border-solid border border-black mx-auto w-fit p-2 mb-2'>
              <div className='text-center px-3 pb-6 pt-2'>
                <p className='text-sm text-gray-700 my-4'>
                  Tug Of War Game
                </p>

                <h2 className='mt-8 text-2xl'>

                  {
                    {
                       '0': "\\o/-------|-------ooo____________________",
                       '1': "_ooo-------|-------ooo___________________",
                       '2': "__ooo-------|-------ooo__________________",
                       '3': "___ooo-------|-------ooo_________________",
                       '4': "____ooo-------|-------ooo________________",
                       '5': "_____ooo-------|-------ooo_______________",
                       '6': "______ooo-------|-------ooo______________",
                       '7': "_______ooo-------|-------ooo_____________",
                       '8': "________ooo-------|-------ooo____________",
                       '9': "_________ooo-------|-------ooo___________",
                      '10': "__________ooo-------|-------ooo__________",
                      '11': "___________ooo-------|-------ooo_________",
                      '12': "____________ooo-------|-------ooo________",
                      '13': "_____________ooo-------|-------ooo_______",
                      '14': "______________ooo-------|-------ooo______",
                      '15': "_______________ooo-------|-------ooo_____",
                      '16': "________________ooo-------|-------ooo____",
                      '17': "_________________ooo-------|-------ooo___",
                      '18': "__________________ooo-------|-------ooo__",
                      '19': "___________________ooo-------|-------ooo_",
                      '20': "____________________ooo-------|-------\\o/",
                    }[gameDataState ? gameDataState.playerPosition : 10]
                  }
                </h2>
              </div>
            </div>

            <li className='flex flex-row justify-between mx-10 text-xl my-4'>

              {reference && currentPlayerPosition != null && (currentPlayerPosition > 0 && currentPlayerPosition < 20) && (
                <QRCode
                  instruction={"pull_left"}
                  address={reference}
                  size={360}
                />
              )}
              {reference && currentPlayerPosition != null && (currentPlayerPosition > 0 && currentPlayerPosition < 20) && (
                <QRCode
                  instruction={"pull_right"}
                  address={reference}
                  size={360}
                />
              )}
              {reference && !gameDataState && (
                <QRCode
                  instruction={"initialize"}
                  address={reference}
                  size={360}
                />
              )}

              {reference && currentPlayerPosition != null && gameDataState != null && (currentPlayerPosition <= 0 || currentPlayerPosition >= 20) && (
                <QRCode
                  instruction={"restart"}
                  address={reference}
                  size={360}
                />
              )}


              {/* Bug: These solana pay qr codes always show the same QR code */}
              {/* 
                  {reference && gameDataState && (
                    <PayQR 
                    reference={reference}
                    direction={0}
                  />
                  )}{reference && gameDataState && (
                    <PayQR 
                    reference={reference}
                    direction={1}
                  />
                  )}
                */}

            </li>
          </div>
        </div>
      </div>}
    </main>
  );
}
