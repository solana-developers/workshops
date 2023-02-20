import { BN } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import BalanceSection from 'components/BalanceSection';
import useAnchorProgram from 'hooks/useAnchorProgram';
import { FC, useEffect, useState } from 'react';
import useLoansStore from 'stores/useLoansStore';
import {
    calculate3MinExpiration,
    calculateEstimatedCollateral,
    createCreateNewLoanInstruction,
} from 'utils/token-lender';

export const CreateNewView: FC = ({}) => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const program = useAnchorProgram();
    const { loans, getAllLoans } = useLoansStore();

    const [depositAmount, setDepositAmount] = useState<number>();
    const [interestRate, setInterestRate] = useState<number>();
    const [estimatedCollateral, setEstimatedCollateral] = useState<number>();

    const updateDepositAmount = (amount: number) => {
        setDepositAmount(amount);
        setEstimatedCollateral(
            calculateEstimatedCollateral(amount, interestRate),
        );
    };

    const updateInterestRate = (rate: number) => {
        setInterestRate(rate);
        setEstimatedCollateral(
            calculateEstimatedCollateral(depositAmount, rate),
        );
    };

    const create = async () => {
        const loanId = loans.length + 1;
        const expiration = await calculate3MinExpiration(connection);
        await wallet.sendTransaction(
            new Transaction().add(
                await createCreateNewLoanInstruction(
                    program,
                    loanId,
                    new BN(depositAmount),
                    new BN(expiration),
                    wallet.publicKey,
                ),
            ),
            connection,
        );
    };

    useEffect(() => {
        getAllLoans(program);
    }, [wallet]);

    return (
        <div className="md:hero mx-auto p-4">
            <div className="md:hero-content flex flex-col">
                <div className="mt-6">
                    <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 to-cyan-300 mb-4">
                        Issue a New Loan
                    </h1>
                </div>
                <div className="text-slate-400 text-center">
                    <p>
                        <span className="font-bold">Note:</span> for demo
                        purposes, loan expiration is set to ~3 minutes
                    </p>
                </div>
                <div className="w-auto p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="mt-2 mb-4 mx-auto">
                        <input
                            className="w-56 p-2 rounded-lg text-center bg-slate-600 text-white placeholder:text-slate-400"
                            placeholder="Amount in USDC"
                            onChange={e =>
                                updateDepositAmount(Number(e.target.value))
                            }
                        />
                    </div>
                    <div className="mt-2 mb-4 flex flex-row text-left">
                        <input
                            className="p-2 rounded-lg text-center bg-slate-600 text-white placeholder:text-slate-400"
                            placeholder="Interest rate"
                            onChange={e =>
                                updateInterestRate(Number(e.target.value))
                            }
                        />
                        <p className="ml-2 my-auto text-lg text-slate-400">%</p>
                    </div>
                    {depositAmount &&
                        depositAmount != 0 &&
                        interestRate &&
                        interestRate != 0 && (
                            <div className="flex flex-col text-center">
                                <span className="text-slate-500 mr-2">
                                    Estimated Collateral:
                                </span>
                                <p className="mb-6 font-normal text-gray-500 dark:text-gray-300">
                                    {estimatedCollateral} SOL
                                </p>
                            </div>
                        )}
                    <div className="relative group items-center text-center">
                        <div
                            className="m-1 absolute -inset-0.5 bg-gradient-to-r from-green-500 to-cyan-500 
                    rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
                        ></div>
                        <button
                            className="px-8 m-2 btn animate-pulse bg-gradient-to-br from-green-500 to-cyan-500 hover:from-white hover:to-cyan-300 text-black"
                            onClick={() => create()}
                        >
                            <span>Create Loan</span>
                        </button>
                    </div>
                </div>
                <BalanceSection />
            </div>
        </div>
    );
};
