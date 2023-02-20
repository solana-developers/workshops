import type { NextPage } from 'next';
import Head from 'next/head';
import { CreateNewView } from 'views/create-new';

const Home: NextPage = props => {
    return (
        <div>
            <Head>
                <title>Token Lender</title>
                <meta name="description" content="Token Lender" />
            </Head>
            <CreateNewView />
        </div>
    );
};

export default Home;
