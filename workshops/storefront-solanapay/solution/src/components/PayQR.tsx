import { encodeURL, createQR } from '@solana/pay';
import { FC, useEffect, useRef, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { SIMULATED_BONK_MINT, SIMULATED_USDC_MINT } from '../util/const';


type SupportedSplToken = {
  symbol: string;
  mint?: string;
};

type TransactionRequestQRProps = {
  reference: PublicKey;
  total: number;
  order: number;
  pepperoni: number;
  mushrooms: number;
  olives: number;
};

const queryBuilder = (baseUrl: string, params: string[][]) => {
  let url = baseUrl + '?';
  params.forEach((p, i) => url += p[0] + '=' + p[1] + (i != params.length - 1 ? '&' : ''));
  console.log(url)
  return url;
}

const PayQR: FC<TransactionRequestQRProps> = (
  { reference, total, order, pepperoni, mushrooms, olives }
) => {
  const [currentTokenSelection, setCurrentTokenSelection] =
    useState<SupportedSplToken>({ symbol: 'SOL', mint: 'SOL' });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = [
      ['reference', reference.toBase58()],
      ['amount', (total * 0.001).toString()],
      ['order', order.toString()],
      ['pepperoni', pepperoni.toString()],
      ['mushrooms', mushrooms.toString()],
      ['olives', olives.toString()],
    ];
    if (currentTokenSelection.mint) params.push(['token', currentTokenSelection.mint]);
    const apiUrl = queryBuilder(
      `${window.location.protocol}//${window.location.host}/api/transaction`,
      params,
    );
    const qr = createQR(
      encodeURL({ link: new URL(apiUrl) }),
      360,
      'transparent'
    );
    qr.update({ backgroundOptions: { round: 1000 } });
    if (ref.current) {
      ref.current.innerHTML = '';
      qr.append(ref.current);
    }
  }, [total, reference, currentTokenSelection, order, pepperoni, mushrooms, olives]);

  return (
    <div className='bg-white shadow-md rounded-2xl border-solid border border-black w-auto text-center flex flex-col justify-between mx-auto'>
      <div className='justify-self-start m-2 mt-4'>
        <p>Select an SPL Token to pay with:</p>
        <li className='flex flex-row justify-between mx-10 text-xl my-4'>
          <button
            className={`rounded-lg border-solid border border-gray-500 bg-green-600 p-2 bg-opacity-${currentTokenSelection.symbol === 'SOL' ? 20 : 60}`}
            onClick={() => setCurrentTokenSelection({ symbol: 'SOL', mint: 'SOL' })}
            disabled={currentTokenSelection.symbol === 'SOL'}
          >
            SOL
          </button>
          <button
            className={`rounded-lg border-solid border border-gray-500 bg-blue-600 p-2 bg-opacity-${currentTokenSelection.symbol === 'USDC' ? 20 : 60}`}
            onClick={() => setCurrentTokenSelection({ symbol: 'USDC', mint: SIMULATED_USDC_MINT })}
            disabled={currentTokenSelection.symbol === 'USDC'}
          >
            USDC
          </button>
          <button
            className={`rounded-lg border-solid border border-gray-500 bg-orange-400 p-2 bg-opacity-${currentTokenSelection.symbol === 'BONK' ? 20 : 60}`}
            onClick={() => setCurrentTokenSelection({ symbol: 'BONK', mint: SIMULATED_BONK_MINT })}
            disabled={currentTokenSelection.symbol === 'BONK'}
          >
            BONK
          </button>
        </li>
        {currentTokenSelection && (
          <p className='my-auto'>
            Current selection:{' '}
            <span
              className={`font-bold text-xl`}
            >
              {currentTokenSelection.symbol}
            </span>
          </p>
        )}
      </div>
      <div ref={ref} className='rounded-xl overflow-hidden'></div>
    </div>
  );
};

export default PayQR;
