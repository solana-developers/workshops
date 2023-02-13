'use client'; // this makes next know that this page should be rendered in the client
import { useEffect, useState } from 'react';
import { CONNECTION } from '@/src/util/const';
import { GameDataAccount, displayPlayerPosition, getGameDataAccountPublicKey } from '@/src/util/move';
import PayQR from '@/src/components/PayQR';

export default function Home() {
  const [gameDataState, setGameDataState] = useState<GameDataAccount>()
  const [currentPlayerPosition, setCurrentPlayerPosition] = useState<number>();
  const [playerDisplay, setPlayerDisplay] = useState<string>();
  let counter = 0;

  useEffect(() => {

    setInterval(() => {
      UpdatePlayerDisplay();
    }, 1300);

    const gameDataAccountPublicKey = getGameDataAccountPublicKey();

    CONNECTION.onAccountChange(
      gameDataAccountPublicKey,
      (updatedAccountInfo, context) => {
        {
          const gameDataParsed = GameDataAccount.fromBuffer(updatedAccountInfo.data);
          setGameDataState(gameDataParsed);
          setCurrentPlayerPosition(gameDataParsed.playerPosition);
        }
      },
      "confirmed"
    );

    const asncFunc = async () => {
      const gameDataAccountPublicKey = getGameDataAccountPublicKey();
      console.log(gameDataAccountPublicKey);
      const gameData = await displayPlayerPosition(
        CONNECTION,
        gameDataAccountPublicKey,
      );
      setGameDataState(gameData);
      setCurrentPlayerPosition(gameData.playerPosition);
    };

    asncFunc();

  }, []);

  function UpdatePlayerDisplay() {
    counter++;
    counter = counter % 4;
    if (counter == 1) {
      setPlayerDisplay("Ooo-------|-------oOO");
    } else if (counter == 2) {
      setPlayerDisplay("ooO-------|-------oOo");
    } else if (counter == 3) {
      setPlayerDisplay("OoO-------|-------OOo");
    } else {
      setPlayerDisplay("oOo-------|-------Ooo");
    }
  }

  return (
    <main className='min-h-screen bg-blue-500 p-2'>
      {<div className="w-full min-h-screen bg-no-repeat bg-cover bg-center bg-fixed bg-[url('../public/bg.jpg')]">
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
                      '1': "_" + playerDisplay + "___________________",
                      '2': "__" + playerDisplay + "__________________",
                      '3': "___" + playerDisplay + "_________________",
                      '4': "____" + playerDisplay + "________________",
                      '5': "_____" + playerDisplay + "_______________",
                      '6': "______" + playerDisplay + "______________",
                      '7': "_______" + playerDisplay + "_____________",
                      '8': "________" + playerDisplay + "____________",
                      '9': "_________" + playerDisplay + "___________",
                      '10': "__________" + playerDisplay + "__________",
                      '11': "___________" + playerDisplay + "_________",
                      '12': "____________" + playerDisplay + "________",
                      '13': "_____________" + playerDisplay + "_______",
                      '14': "______________" + playerDisplay + "______",
                      '15': "_______________" + playerDisplay + "_____",
                      '16': "________________" + playerDisplay + "____",
                      '17': "_________________" + playerDisplay + "___",
                      '18': "__________________" + playerDisplay + "__",
                      '19': "___________________" + playerDisplay + "_",
                      '20': "____________________ooo-------|-------\\o/",
                    }[gameDataState ? gameDataState.playerPosition : 10]
                  }
                </h2>
              </div>
            </div>

            <li className='flex flex-row justify-between mx-10 text-xl my-4'>

              {currentPlayerPosition != null && (currentPlayerPosition > 0 && currentPlayerPosition < 20) && (
                <PayQR instruction={"pull_left"} />
              )}

              {currentPlayerPosition != null && (currentPlayerPosition > 0 && currentPlayerPosition < 20) && (
                <PayQR instruction={"pull_right"} />
              )}

              {!gameDataState && (
                <PayQR instruction={"initialize"} />
              )}

              {currentPlayerPosition != null && gameDataState != null && (currentPlayerPosition <= 0 || currentPlayerPosition >= 20) && (
                <PayQR instruction={"restart"} />
              )}
            </li>
          </div>
          {CONNECTION._rpcEndpoint}
        </div>
      </div>}
    </main>
  );
}
