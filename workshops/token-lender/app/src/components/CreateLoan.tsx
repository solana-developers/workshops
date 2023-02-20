import { useRouter } from 'next/router';
import { FC } from 'react';

const CreateLoan: FC = () => {
    const router = useRouter();
    return (
        <div className="flex flex-row justify-center">
            <div className="relative group items-center">
                <div
                    className="m-1 absolute -inset-0.5 bg-gradient-to-r from-green-500 to-cyan-500 
                    rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
                ></div>
                <button
                    className="px-8 m-2 btn animate-pulse bg-gradient-to-br from-green-500 to-cyan-500 hover:from-white hover:to-cyan-300 text-black"
                    onClick={() => router.push('/create-new')}
                >
                    <span>Create a Loan</span>
                </button>
            </div>
        </div>
    );
};

export default CreateLoan;
