import { utils as anchorUtil } from '@project-serum/anchor';
import { getAccount } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { USDC_MINT } from 'utils/const';
import create, { State } from 'zustand';

interface UserUSDCBalanceStore extends State {
    balanceUsdc: number;
    getUserUSDCBalance: (publicKey: PublicKey, connection: Connection) => void;
}

const useUserUSDCBalanceStore = create<UserUSDCBalanceStore>((set, _get) => ({
    balanceUsdc: 0,
    getUserUSDCBalance: async (publicKey, connection) => {
        let balanceUsdc = 0;
        try {
            balanceUsdc = Number(
                (
                    await getAccount(
                        connection,
                        await anchorUtil.token.associatedAddress({
                            mint: USDC_MINT,
                            owner: publicKey,
                        }),
                    )
                ).amount,
            );
        } catch (e) {
            console.log(`error getting balanceUsdc: `, e);
        }
        set(s => {
            s.balanceUsdc = balanceUsdc;
            console.log(`balanceUsdc updated, `, balanceUsdc);
        });
    },
}));

export default useUserUSDCBalanceStore;
