import { encodeURL, createQR } from '@solana/pay';
import { useEffect, useRef, useState } from 'react';

const pizzeriaPubkey = "7aU2utTfmNLxUhcQytiEELFdpZ6HXTdjpEXi6RmLRF8N";

type SupportedSplToken = { symbol: string, address: null | string, color: string }

const PayQR = () => {

  const sol = { symbol: "SOL", address: null, color: "green-600" }
  const usdc = { symbol: "USDC", address: "", color: "blue-600" }
  const bonk = { symbol: "BONK", address: "", color: "orange-400" }
  const availableTokens: SupportedSplToken[] = [sol, usdc, bonk]

  const [currentTokenSelection, setCurrentTokenSelection] = useState<SupportedSplToken>(sol)
  
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiUrl = `${window.location.protocol}//${window.location.host}/api/transaction?reference=${pizzeriaPubkey}`
    const qr = createQR(encodeURL({ link: new URL(apiUrl) }), 360, 'transparent')
    qr.update({ backgroundOptions: { round: 1000 } });
    if (ref.current) {
      ref.current.innerHTML = ''
      qr.append(ref.current)
    }
  }, [])

  return (
    <div className='bg-white shadow-md rounded-2xl w-auto text-center flex flex-col justify-between mx-auto'>
      <div className="justify-self-start m-2 mt-4">
          <p>Select an SPL Token to pay with:</p>
          <li
            className="flex flex-row justify-between mx-10 text-xl my-4"
          >
            {availableTokens.map((token) => {
              return (
                <button 
                  key={token.symbol}
                  className={`rounded-lg border-solid border border-gray-500 bg-${token.color} p-2 bg-opacity-${currentTokenSelection.symbol === token.symbol ? 20 : 60}`}
                  onClick={() => setCurrentTokenSelection(token)}
                  disabled={currentTokenSelection.symbol === token.symbol}
                >
                  {token.symbol}
                </button>
              )
            })}
          </li>
          {currentTokenSelection && (
            <p className='my-auto'>
              Current selection: <span className={`font-bold text-xl text-${currentTokenSelection.color}`}>{currentTokenSelection.symbol}</span>
            </p>
          )}
      </div>
      <div ref={ref} className='rounded-xl overflow-hidden'></div>
    </div>
  )

}

export default PayQR