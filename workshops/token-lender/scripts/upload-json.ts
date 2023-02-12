import { bundlrStorage, Metaplex, keypairIdentity, toMetaplexFile } from "@metaplex-foundation/js";
import { Connection, Keypair } from "@solana/web3.js";
import fs from 'fs';
import os from 'os';

async function main() {
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
        name: "Loan Note Token",
        symbol: "RCPT",
        description: "Token representing an outstanding loan note.",
        image: toMetaplexFile(fs.readFileSync('./scripts/logo.jpeg'), 'logo.jpeg', { contentType: 'image' }),
    });
    console.log(`URI: ${uri}`);
}

main()