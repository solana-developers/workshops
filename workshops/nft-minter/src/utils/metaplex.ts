import { bundlrStorage, Metaplex, toMetaplexFileFromBrowser, walletAdapterIdentity } from "@metaplex-foundation/js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";

export async function loadAllOwnedNftsInCollection(
    connection: Connection,
    networkConfiguration: string, 
    wallet: WalletContextState,
) {
    const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet))
        .use(bundlrStorage({ address: `https://${networkConfiguration}.bundlr.network` }));
    const nfts = await metaplex.nfts().findAllByOwner({ owner: wallet.publicKey });
    return nfts.filter((nft) => nft.collection.address === new PublicKey("CPpyd2Uq1XkCkd9KHswjttdQXTvZ4mmrnif3tXg9i8sk"))
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
    const { mintAddress, response } = await metaplex.nfts().create({
        name: tokenName,
        uri: uri,
        sellerFeeBasisPoints: 0,
        tokenOwner: wallet.publicKey,
        mintTokens: true,
    });
    return [mintAddress.toBase58(), response.signature];
}
