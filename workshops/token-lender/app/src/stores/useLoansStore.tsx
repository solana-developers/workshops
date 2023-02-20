import { Idl, IdlTypes, Program } from '@project-serum/anchor';
import { TokenLender } from 'idl/token_lender';
import create, { State } from 'zustand';

interface LoansStore extends State {
    loans: IdlTypes<Idl>['LoanEscrow'][] | any[];
    getAllLoans: (program: Program<TokenLender>) => void;
}

const useLoansStore = create<LoansStore>((set, _get) => ({
    loans: [],
    getAllLoans: async (program: Program<TokenLender>) => {
        let loans = [];
        try {
            loans = await program.account.loanEscrow.all();
            console.log(`Loan Count: ${loans.length}`);
        } catch (e) {
            console.log(`error getting balance: `, e);
        }
        set(s => {
            s.loans = loans;
        });
    },
}));

export default useLoansStore;
