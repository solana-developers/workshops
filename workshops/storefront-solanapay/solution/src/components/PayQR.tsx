import { Cluster, clusterApiUrl, Connection, PublicKey, Keypair } from '@solana/web3.js';
import { encodeURL, createQR, TransactionRequestURLFields } from '@solana/pay';
import BigNumber from 'bignumber.js';
import { useEffect, useRef } from 'react';

const PayQR = () => {
    const ref = useRef<HTMLDivElement>(null);

    const networkConfiguration = 'devnet'
    

    useEffect(() => {
    const { location } = window
    const reference = Keypair.generate().publicKey
    const apiUrl = `${location.protocol}//${location.host}/api/transaction?reference=${reference.toBase58()}`
    const urlParams: TransactionRequestURLFields = {
      link: new URL(apiUrl)
    };
    const solanaUrl = encodeURL(urlParams);
    console.log(solanaUrl)
    const qr = createQR(solanaUrl, 512, 'transparent')
    qr.update({ backgroundOptions: { round: 1000 } });
    if (ref.current) {
      ref.current.innerHTML = ''
      qr.append(ref.current)
    }
    }, []); 

    
    return (
<div className='mt-5'>
    <div ref={ref} className='rounded-xl overflow-hidden'></div>
</div>
    )

}

export default PayQR