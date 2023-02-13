import { encodeURL, createQR } from '@solana/pay';
import { FC, useEffect, useRef, useState } from 'react';
import { Keypair, PublicKey } from '@solana/web3.js';
import QRCode from "qrcode";

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

const useGetQRCode = (instruction: String, reference: PublicKey, size: number) => {
  const [qr, setQr] = useState("");

  const [currentTokenSelection, setCurrentTokenSelection] =
    useState<SupportedSplToken>({ symbol: 'SOL', mint: 'SOL' });

    useEffect(() => {
      const params = [
        ['reference', reference.toBase58()],
        ['amount', (0.001).toString()],
        ['instruction', instruction.toString()],
      ];
      if (currentTokenSelection.mint) params.push(['token', currentTokenSelection.mint]);
      const apiUrl = queryBuilder(
        `${window.location.protocol}//${window.location.host}/api/transaction`,
        params,
      );

      let parsedUrl = encodeURL({ link: new URL(apiUrl) })

      QRCode.toDataURL(
        parsedUrl.toString(),
        {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (err, url) => {
          if (err) return console.error(err);
  
          setQr(url);
        }
      );
    }, [reference, instruction]);
  
    return { qrCode: qr };
  };
  export default useGetQRCode;