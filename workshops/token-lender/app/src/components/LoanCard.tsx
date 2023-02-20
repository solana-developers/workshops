import { BN, utils as anchorUtil } from '@project-serum/anchor';
import { getAccount } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { useNetworkConfiguration } from 'contexts/NetworkConfigurationProvider';
import useAnchorProgram from 'hooks/useAnchorProgram';
import { FC, useEffect, useState } from 'react';
import { LoanStatus, USDC_MINT } from 'utils/const';
import {
    createAcceptLoanInstruction,
    createCloseExpiredInstruction,
    createCloseReturnedInstruction,
    createReturnFundsInstruction,
} from 'utils/token-lender';

interface LoanCardProps {
    address: PublicKey;
    loanId: number;
    amount: number;
    expiration: number;
    lender: PublicKey;
    status: LoanStatus;
    borrower?: PublicKey;
}

const LoanCard: FC<LoanCardProps> = (props: LoanCardProps) => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const { networkConfiguration } = useNetworkConfiguration();
    const program = useAnchorProgram();

    const [loanIsRepaid, setLoanIsRepaid] = useState<boolean>();
    const [loanIsExpired, setLoanIsExpired] = useState<boolean>();

    const checkLoanRepaid = async () => {
        const usdcBalance = Number(
            (
                await getAccount(
                    connection,
                    await anchorUtil.token.associatedAddress({
                        mint: USDC_MINT,
                        owner: props.address,
                    }),
                )
            ).amount,
        );
        setLoanIsRepaid(
            props.status === 'claimed' && usdcBalance >= props.amount,
        );
    };

    const checkLoanExpired = async () => {
        const currentSlot = await connection.getSlot();
        setLoanIsExpired(
            props.status === 'claimed' && currentSlot >= props.expiration,
        );
    };

    useEffect(() => {
        checkLoanRepaid();
        checkLoanExpired();
    }, []);

    const borrow = async () => {
        await wallet.sendTransaction(
            new Transaction().add(
                await createAcceptLoanInstruction(
                    program,
                    props.loanId,
                    wallet.publicKey,
                    props.lender,
                ),
            ),
            connection,
        );
    };

    const repay = async () => {
        await wallet.sendTransaction(
            new Transaction().add(
                await createReturnFundsInstruction(
                    program,
                    props.loanId,
                    new BN(props.amount),
                    wallet.publicKey,
                ),
            ),
            connection,
        );
    };

    const closeReturned = async () => {
        await wallet.sendTransaction(
            new Transaction().add(
                await createCloseReturnedInstruction(
                    program,
                    props.loanId,
                    props.lender,
                ),
            ),
            connection,
        );
    };

    const closeExpired = async () => {
        await wallet.sendTransaction(
            new Transaction().add(
                await createCloseExpiredInstruction(
                    program,
                    props.loanId,
                    props.lender,
                ),
            ),
            connection,
        );
    };

    return (
        <div className="w-auto pt-0 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="w-full text-right my-0 mb-2">
                <a
                    className="inline-flex mt-3 ml-2 items-center text-sm font-medium text-center text-slate-400"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://explorer.solana.com/address/${props.address.toBase58()}/anchor-account?cluster=${networkConfiguration}`}
                >
                    Explorer
                    <svg
                        aria-hidden="true"
                        className="w-4 h-4 ml-2 -mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                        ></path>
                    </svg>
                </a>
            </div>
            <div className="mb-4 flex flex-row align-middle space-x-4">
                <img
                    className="my-auto"
                    width={35}
                    height={35}
                    src="/usdc.png"
                    alt="usdc"
                />
                <p className="h-auto my-auto font-normal text-gray-700 dark:text-gray-200">
                    {props.amount}
                </p>
            </div>
            <p className="mb-6 font-normal text-gray-700 dark:text-gray-400">
                <span className="text-slate-500 mr-2">Expires:</span>
                {props.expiration}
            </p>

            {props.status === 'available' && (
                <div>
                    <div className="mb-2 ml-0 text-left text-green-600">
                        <p>Available</p>
                    </div>
                    <button
                        onClick={() => borrow()}
                        className="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                        Borrow
                    </button>
                </div>
            )}
            {props.status === 'claimed' && (
                <div>
                    <div className="mb-2 ml-0 text-left text-orange-600">
                        <p>Claimed</p>
                    </div>
                    {props.borrower && props.borrower.equals(wallet.publicKey) && (
                        <div>
                            <div className="mb-2 text-slate-400 text-sm text-left">
                                <p>You borrowed this loan</p>
                            </div>
                            {loanIsRepaid ? (
                                <div className="mb-2 text-slate-400 text-sm text-left">
                                    <p>
                                        {props.borrower.equals(wallet.publicKey)
                                            ? 'You'
                                            : 'The Borrower'}{' '}
                                        repaid this loan ✅
                                    </p>
                                </div>
                            ) : (
                                <button
                                    onClick={() => repay()}
                                    className="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-orange-700 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                                >
                                    Repay
                                </button>
                            )}
                        </div>
                    )}
                    {props.lender && props.lender.equals(wallet.publicKey) && (
                        <div>
                            <div className="text-slate-400 text-sm text-left">
                                <p>You issued this loan</p>
                            </div>
                            {loanIsRepaid && (
                                <div>
                                    <div className="text-slate-400 text-sm text-left">
                                        <p>The borrower repaid this loan</p>
                                    </div>
                                    <button
                                        onClick={() => closeReturned()}
                                        className="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-orange-700 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                            {loanIsExpired && !loanIsRepaid && (
                                <div>
                                    <div className="text-slate-400 text-sm text-left">
                                        <p>This loan has expired</p>
                                    </div>
                                    <button
                                        onClick={() => closeExpired()}
                                        className="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-orange-700 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            {props.status === 'closed' && (
                <div>
                    <div className="mb-2 ml-0 text-left text-slate-400">
                        <p>Loan Closed</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoanCard;
