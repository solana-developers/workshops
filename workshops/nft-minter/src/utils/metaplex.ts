import { bundlrStorage, Metaplex, toMetaplexFileFromBrowser, walletAdapterIdentity } from "@metaplex-foundation/js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";

const WORKSHOP_COLLECTION = new PublicKey("CPpyd2Uq1XkCkd9KHswjttdQXTvZ4mmrnif3tXg9i8sk");

export async function loadAllOwnedNftsInCollection(
    connection: Connection,
    networkConfiguration: string, 
    wallet: WalletContextState,
) {
    const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet))
        .use(bundlrStorage({ address: `https://${networkConfiguration}.bundlr.network` }));
    const nfts = await metaplex.nfts().findAllByOwner({ owner: wallet.publicKey });
    return nfts.filter((nft) => nft.collection.address === WORKSHOP_COLLECTION)
}

export async function mintWithMetaplexJs(
    connection: Connection,
    networkConfiguration: string, 
    wallet: WalletContextState,
    tokenName: string,
    tokenSymbol: string,
    tokenDescription: string,
    image: File,
): Promise<[string, string]> {

    const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet))
        .use(bundlrStorage({ address: `https://${networkConfiguration}.bundlr.network` }));
    const { uri } = await metaplex.nfts().uploadMetadata({
        name: tokenName,
        symbol: tokenSymbol,
        description: tokenDescription,
        image: await toMetaplexFileFromBrowser(image),
    });
    const { nft, response } = await metaplex.nfts().create({
        name: tokenName,
        symbol: tokenSymbol,
        uri: uri,
        sellerFeeBasisPoints: 0,
        tokenOwner: wallet.publicKey,
        mintTokens: true,
        collection: WORKSHOP_COLLECTION,
    });
    return [nft.address.toBase58(), response.signature];
}
