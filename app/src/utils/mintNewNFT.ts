// import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js"; import { connection } from '@/utils/verifyNFT'
// import { Keypair } from "@solana/web3.js";

console.log(typeof process.env.SECRET)
// const metaplex = Metaplex.make(connection)
//     .use(keypairIdentity(wallet()))
//     .use(bundlrStorage())

export async function mint() {
    console.log("Minting")
    console.log('metaplex')
    // const nft = await metaplex.create
}
