// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { initWallet, useWallet } from 'solana-wallets-vue';
import {
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    // SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
// import { Keypair } from '@solana/web3.js';

const wallets = [
    new PhantomWalletAdapter(),
    new SlopeWalletAdapter(),
    // new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
]

initWallet({ wallets, autoConnect: true })

export const wallet = useWallet();
