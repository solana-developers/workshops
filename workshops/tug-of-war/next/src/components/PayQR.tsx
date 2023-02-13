import { encodeURL, createQR } from '@solana/pay';
import { FC, useEffect, useRef, useState } from 'react';
import { Keypair, PublicKey } from '@solana/web3.js';

type SupportedSplToken = {
  symbol: string;
  mint?: string;
};

type TransactionRequestQRProps = {
  reference: PublicKey;
  direction: number;
};

const queryBuilder = (baseUrl: string, params: string[][]) => {
  let url = baseUrl + '?';
  params.forEach((p, i) => url += p[0] + '=' + p[1] + (i != params.length - 1 ? '&' : ''));
  console.log(url)
  return url;
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const PayQR: FC<TransactionRequestQRProps> = (
  { reference, direction }
) => {
  const [currentTokenSelection, setCurrentTokenSelection] =
    useState<SupportedSplToken>({ symbol: 'SOL', mint: 'SOL' });

  useEffect(() => {
    console.log("Direction= " + direction.toString());
    const params = [
      ['reference', new Keypair().publicKey.toBase58()],
      ['amount', (0.002).toString()],
      ['direction', (getRandomInt(255)).toString()],
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

    // get a handle of the element
    let element = document.getElementById(direction.toString());

    if (element != null) {
      // append QR code to the element
      qr.append(element);
    }
    
  },[])

  return (
    <div className='bg-white shadow-md rounded-2xl border-solid border border-black w-auto text-center flex flex-col justify-between mx-auto'>

      <div className='justify-self-start m-2 mt-4'>
        <p>{direction == 1 ? " Pull Right"+direction : "Pull Left"+direction}</p>
      </div>

      <div id={direction.toString()} className='rounded-xl overflow-hidden'></div>

    </div>
  );
};

export default PayQR;
