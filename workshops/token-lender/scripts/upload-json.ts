import { bundlrStorage, Metaplex, keypairIdentity, toMetaplexFile } from "@metaplex-foundation/js";
import { Connection, Keypair } from "@solana/web3.js";
import fs from 'fs';
import os from 'os';

async function uploadMetadata(
    name: string,
    symbol: string,
    description: string,
    imagePath: string,
    imageName: string,
) {
    const metaplex = Metaplex.make(
        new Connection('https://api.devnet.solana.com/', 'confirmed')
    )
        .use(keypairIdentity(
            Keypair.fromSecretKey(
                Buffer.from(JSON.parse(fs.readFileSync(
                    os.homedir() + '/.config/solana/id.json', 
                    "utf-8"
                )))
            )
        ))
        .use(bundlrStorage({ address: `https://devnet.bundlr.network` }));
    const { uri } = await metaplex.nfts().uploadMetadata({
        name,
        symbol,
        description,
        image: toMetaplexFile(fs.readFileSync(imagePath), imageName, { contentType: 'image' }),
    });
    console.log(`URI: ${uri}`);
}

async function uploadLoanNoteMetadata() {
    await uploadMetadata(
        "Loan Note Token",
        "RCPT",
        "Token representing an outstanding loan note.",
        "./scripts/logo.jpeg",
        "logo.jpeg",
    )
}

async function uploadMockUsdcMetadata() {
    await uploadMetadata(
        "Mock USDC",
        "mUSD",
        "Token representing devnet USDC.",
        "./scripts/usdc.png",
        "usdc.png",
    )
}

// uploadLoanNoteMetadata()
uploadMockUsdcMetadata()