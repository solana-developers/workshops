// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
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
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
  transfer,
} from '@solana/spl-token';
import { createTransfer } from '@solana/pay';

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

function getFromQuery(req: NextApiRequest, field: string): string | undefined {
  if (!(field in req.query)) return undefined;

  const value = req.query[field];
  if (typeof value === 'string') return value;
  // value is string[]

  if (value.length === 0 || value == undefined) return undefined;
  return value[0];
}

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

  const reference = getFromQuery(req, 'reference');
  if (!reference) throw new Error('missing reference');

  const amount = getFromQuery(req, 'amount');
  if (!amount) throw new Error('missing amount');

  const token = getFromQuery(req, 'token');
  if (!token) throw new Error('missing token');

  const sender = new PublicKey(accountField);

  // create the token transfer instruction
  const transferToken = async () => {
    if (token === 'SOL') {
      const solTransfer = await SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: MERCHANT_WALLET,
        lamports: Number(amount) * LAMPORTS_PER_SOL,
      });
      solTransfer.keys.push({
        pubkey: new PublicKey(reference),
        isSigner: false,
        isWritable: false,
      });
      return await solTransfer;
    } else {
      const senderInfo = await connection.getAccountInfo(sender);
      if (!senderInfo) throw new Error('sender not found');
      const splToken = new PublicKey(token);

      // Get the sender's ATA and check that the account exists and can send tokens
      const senderATA = await getAssociatedTokenAddress(splToken, sender);
      const senderAccount = await getAccount(connection, senderATA);
      if (!senderAccount.isInitialized)
        throw new Error('sender not initialized');
      if (senderAccount.isFrozen) throw new Error('sender frozen');

      // Get the merchant's ATA and check that the account exists and can receive tokens
      const merchantATA = await getAssociatedTokenAddress(
        splToken,
        MERCHANT_WALLET
      );
      const merchantAccount = await getAccount(connection, merchantATA);
      if (!merchantAccount.isInitialized)
        throw new Error('merchant not initialized');
      if (merchantAccount.isFrozen) throw new Error('merchant frozen');

      // Check that the token provided is an initialized mint
      const mint = await getMint(connection, splToken);
      if (!mint.isInitialized) throw new Error('mint not initialized');
      let transferAmount = BigNumber(amount)
        .times(BigNumber(10).pow(mint.decimals))
        .integerValue(BigNumber.ROUND_FLOOR);
      const tokens = BigInt(String(transferAmount));
      if (tokens > senderAccount.amount) console.log('ggs bad code');
      // Create an instruction to transfer SPL tokens, asserting the mint and decimals match
      const splTransferIx = createTransferCheckedInstruction(
        senderATA,
        splToken,
        merchantATA,
        sender,
        tokens,
        mint.decimals
      );

      splTransferIx.keys.push({
        pubkey: new PublicKey(reference),
        isSigner: false,
        isWritable: false,
      });

      // Create a reference that is unique to each checkout session
      return splTransferIx;
    }
  };

  // create the transaction
  const transaction = new Transaction();
  const latestBlockhash = await connection.getLatestBlockhash();
  transaction.feePayer = sender;
  transaction.recentBlockhash = latestBlockhash.blockhash;

  // add the instruction to the transaction
  transaction.add(await transferToken());

  // Serialize and return the unsigned transaction.
  const serializedTransaction = transaction.serialize({
    verifySignatures: false,
    requireAllSignatures: false,
  });

  const base64Transaction = serializedTransaction.toString('base64');
  const message = 'Thanks for buying a Solami!';

  res.status(200).send({ transaction: base64Transaction, message });
};
