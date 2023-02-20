import { useWallet } from '@solana/wallet-adapter-react';
import BalanceSection from 'components/BalanceSection';
import CreateLoan from 'components/CreateLoan';
import LoanCard from 'components/LoanCard';
import useAnchorProgram from 'hooks/useAnchorProgram';
import { FC, useEffect } from 'react';
import useLoansStore from 'stores/useLoansStore';
import { LoanStatus } from 'utils/const';

export const HomeView: FC = ({}) => {
    const wallet = useWallet();
    const program = useAnchorProgram();
    const { loans, getAllLoans } = useLoansStore();

    const getLoanStatus = (loan: any): LoanStatus => {
        if (!loan.account) return 'closed';
        if (!loan.account.borrower.equals(loan.publicKey)) return 'claimed';
        return 'available';
    };

    useEffect(() => {
        if (wallet.publicKey) getAllLoans(program);
    }, [wallet.publicKey]);

    return (
        <div className="md:hero mx-auto p-4">
            <div className="md:hero-content flex flex-col">
                <div className="mt-6">
                    <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 to-cyan-300 mb-4">
                        Token Lender
                    </h1>
                </div>
                {loans && (
                    <div>
                        <CreateLoan />
                        <div className="text-left text-lg mb-2">
                            <h3>Loans Available</h3>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {loans
                                .filter(
                                    loan => getLoanStatus(loan) === 'available',
                                )
                                .map((loan, i) => (
                                    <LoanCard
                                        key={i}
                                        address={loan.publicKey}
                                        loanId={loan.account.loanId}
                                        amount={loan.account.deposit.toNumber()}
                                        expiration={loan.account.expiryTimestamp.toNumber()}
                                        lender={loan.account.lender}
                                        status={'available'}
                                    />
                                ))}
                        </div>
                        <div className="text-left text-lg mb-2 mt-4">
                            <h3>Loans Claimed</h3>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {loans
                                .filter(
                                    loan => getLoanStatus(loan) === 'claimed',
                                )
                                .map((loan, i) => (
                                    <LoanCard
                                        key={i}
                                        address={loan.publicKey}
                                        loanId={loan.account.loanId}
                                        amount={loan.account.deposit.toNumber()}
                                        expiration={loan.account.expiryTimestamp.toNumber()}
                                        lender={loan.account.lender}
                                        status={'claimed'}
                                        borrower={loan.account.borrower}
                                    />
                                ))}
                        </div>
                    </div>
                )}
                <BalanceSection />
            </div>
        </div>
    );
};
