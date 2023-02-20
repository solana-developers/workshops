import { AnchorProvider, Idl, Program } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TokenLender } from 'idl/token_lender';
import idl from '../idl/token_lender.json';

export default function useAnchorProgram(): Program<TokenLender> {
    const { connection } = useConnection();
    const wallet = useWallet();

    const provider = new AnchorProvider(connection, wallet, {});
    return new Program(
        idl as Idl,
        idl.metadata.address,
        provider,
    ) as Program<TokenLender>;
}
