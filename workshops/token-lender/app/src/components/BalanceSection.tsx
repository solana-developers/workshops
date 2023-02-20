import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { FC, useEffect } from 'react';
import useUserSOLBalanceStore from 'stores/useUserSOLBalanceStore';
import useUserUSDCBalanceStore from 'stores/useUserUSDCBalanceStore';
import { RequestAirdrop } from './RequestAirdrop';
import { RequestAirdropUsdc } from './RequestAirdropUsdc';

const BalanceSection: FC = () => {
    const wallet = useWallet();
    const { connection } = useConnection();

    const balanceSol = useUserSOLBalanceStore(s => s.balanceSol);
    const { getUserSOLBalance } = useUserSOLBalanceStore();
    const balanceUsdc = useUserUSDCBalanceStore(s => s.balanceUsdc);
    const { getUserUSDCBalance } = useUserUSDCBalanceStore();

    useEffect(() => {
        if (wallet.publicKey) {
            console.log(wallet.publicKey.toBase58());
            getUserSOLBalance(wallet.publicKey, connection);
            getUserUSDCBalance(wallet.publicKey, connection);
        }
    }, [wallet.publicKey, connection, getUserSOLBalance, getUserUSDCBalance]);
    return (
        <div className="flex flex-row mt-2">
            <div className="flex flex-col text-center">
                <RequestAirdropUsdc />
                <h4 className="md:w-full text-2xl text-slate-300 my-2">
                    {wallet && (
                        <div className="flex flex-row justify-center">
                            <img
                                className="my-auto mr-4"
                                width={35}
                                height={35}
                                src="/usdc.png"
                                alt="usdc"
                            />
                            <div>{(balanceUsdc || 0).toLocaleString()}</div>
                            {/* <div className="text-slate-600 ml-2">USDC</div> */}
                        </div>
                    )}
                </h4>
            </div>
            <div className="flex flex-col text-center">
                <RequestAirdrop />
                <h4 className="md:w-full text-2xl text-slate-300 my-2">
                    {wallet && (
                        <div className="flex flex-row justify-center">
                            <img
                                className="my-auto mr-4"
                                width={35}
                                height={35}
                                src="/solana.png"
                                alt="usdc"
                            />
                            <div>{(balanceSol || 0).toLocaleString()}</div>
                            {/* <div className="text-slate-600 ml-2">SOL</div> */}
                        </div>
                    )}
                </h4>
            </div>
        </div>
    );
};

export default BalanceSection;
