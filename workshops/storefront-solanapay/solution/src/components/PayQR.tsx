import { encodeURL, createQR } from '@solana/pay';
import { FC, useEffect, useRef, useState } from 'react';
import { PublicKey } from '@solana/web3.js';


type SupportedSplToken = {
  symbol: string;
  color: string;
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
  const sol = { symbol: 'SOL', color: 'green-600', mint: 'SOL' };
  const usdc = {
    symbol: 'USDC',
    color: 'blue-600',
    mint: 'EvLepoDXhscvLxbTQ7byj3NE6n6gSNJP3DeZx5k49uLm',
  };
  const bonk = {
    symbol: 'BONK',
    color: 'orange-400',
    mint: 'EvLepoDXhscvLxbTQ7byj3NE6n6gSNJP3DeZx5k49uLm',
  };
  const availableTokens: SupportedSplToken[] = [sol, usdc, bonk];

  const [currentTokenSelection, setCurrentTokenSelection] =
    useState<SupportedSplToken>(sol);

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
          {availableTokens.map((token) => {
            return (
              <button
                key={token.symbol}
                className={`rounded-lg border-solid border border-gray-500 bg-${
                  token.color
                } p-2 bg-opacity-${
                  currentTokenSelection.symbol === token.symbol ? 20 : 60
                }`}
                onClick={() => setCurrentTokenSelection(token)}
                disabled={currentTokenSelection.symbol === token.symbol}
              >
                {token.symbol}
              </button>
            );
          })}
        </li>
        {currentTokenSelection && (
          <p className='my-auto'>
            Current selection:{' '}
            <span
              className={`font-bold text-xl text-${currentTokenSelection.color}`}
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
