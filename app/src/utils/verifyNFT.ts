import * as web3 from '@solana/web3.js'
import {
    resolveToWalletAddress,
    getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";

// import { computed } from 'vue'

import { wallet } from '@/utils/solanaWallet'
import { sign } from 'tweetnacl';
import store from '@/store'

type Collection = {
    name: string;
    family: string;
}
export interface NFT_META {
    key: number;
    mint: string;
    image?: string;
    data?: any;
    symbol?: string;
    name?: string;
    creator_id?: string;
    updateAuthority: string;
    collection?: Collection;
    description?: string;
    external_url?: string;
}
const { publicKey, signMessage } = wallet;

// const connected = computed(() => store.state.connected)
const { Connection, clusterApiUrl } = web3

let url = 'https://solana-api.projectserum.com'
if (process.env.NODE_ENV !== 'production') {
    url = clusterApiUrl('devnet')
}
function createConnection() {
    return new Connection(url);
}

export const connection = createConnection();

async function getNFTInfo(nft: any) {
    try {
        if (nft.data.uri) {

            const res = await fetch(nft.data.uri)
            const data = await res.json()
            return nft = { ...nft, ...data }
        }
        return
    } catch (err) {
        console.log(err)
        return
    }
}

export async function verifyWallet() {
    try {
        // `publicKey` will be null if the wallet isn't connected
        if (!publicKey) throw new Error('Wallet not connected!');
        // `signMessage` will be undefined if the wallet doesn't support it
        if (!signMessage) throw new Error('Wallet does not support message signing!');
        // Encode anything as bytes
        const message = new TextEncoder().encode(`Sign this so we know that this\nwallet is actually yours \n\n\n . . . please.`);
        // Sign the bytes using the wallet
        // @ts-ignore: Object is possibly 'undefined'
        const signature = await signMessage.value(message);

        // Verify that the bytes were signed using the private key that matches the known public key
        // @ts-ignore: Object is possibly 'null'
        if (!sign.detached.verify(message, signature, publicKey.value.toBytes())) throw new Error('Invalid signature!');
        console.log("success")
        return true;
    } catch (err) {
        console.log(err)
        return false;

    }
}

export async function verifyNFT(pubkey: web3.PublicKey) {
    try {

        const publicAddress = await resolveToWalletAddress({
            text: pubkey.toBase58(), connection: connection
        });

        // Return Array of NFT's owned by Connected Wallet
        const nftArray = await getParsedNftAccountsByOwner({
            publicAddress,
            connection: connection
        });

        // console.log(phoenix_Collections)
        console.dir(nftArray)
        const userTokens: string[] = []
        const ownedNFTs: NFT_META[] = []
        nftArray.forEach(async (nft: NFT_META) => {

            console.dir(nft)
            nft = await getNFTInfo(nft)
            console.log({ nft })
            ownedNFTs.push({ ...nft, creator_id: nft.data.creators[0]?.address })
            userTokens.push(nft.mint)

            console.dir(ownedNFTs)
            store.dispatch('updateNFTMeta', ownedNFTs)

        })
        return



    } catch (error) {
        // notify({ type: 'error', message: `Sign Message failed!`, description: error?.message });
        // @ts-ignore: Object is type 'unknown'
        console.log('error', `Sign Message failed! ${error?.message}`);
    }
}