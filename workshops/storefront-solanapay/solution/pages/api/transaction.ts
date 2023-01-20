// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  createTransferCheckedInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
} from '@solana/spl-token';

const MERCHANT_WALLET = new PublicKey(
  'va1yPZsd2qieP5pE6gtxvAHkHKEW3qmtoZy3oN1GcBX'
);
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

type POST = {
  transaction: string;
  message: string;
};

type GET = {
  label: string;
  icon: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return get(req, res);
  }

  if (req.method === 'POST') {
    return post(req, res);
  }
}

const get = async (req: NextApiRequest, res: NextApiResponse<GET>) => {
  const label = 'Solami Pizza';
  const icon =
    'https://media.discordapp.net/attachments/964525722301501477/978683590743302184/sol-logo1.png';

  res.status(200).json({
    label,
    icon,
  });
};

const post = async (req: NextApiRequest, res: NextApiResponse<POST>) => {
  // Account provided in the transaction request body by the wallet.
  const accountField = req.body?.account;
  if (!accountField) throw new Error('missing account');

  const sender = new PublicKey(accountField);

  // create spl transfer instruction
  const solTransfer = await SystemProgram.transfer({
    fromPubkey: sender,
    toPubkey: MERCHANT_WALLET,
    lamports: 1000000000,
  });

  // create the transaction
  const transaction = new Transaction();
  const latestBlockhash = await connection.getLatestBlockhash();
  transaction.feePayer = sender;
  transaction.recentBlockhash = latestBlockhash.blockhash;

  // add the instruction to the transaction
  transaction.add(solTransfer);

  // Serialize and return the unsigned transaction.
  const serializedTransaction = transaction.serialize({
    verifySignatures: false,
    requireAllSignatures: false,
  });

  const base64Transaction = serializedTransaction.toString('base64');
  const message = 'Thanks for buying a Solami!';

  res.status(200).send({ transaction: base64Transaction, message });
};
