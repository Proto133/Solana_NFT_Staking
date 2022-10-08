import * as anchor from "@project-serum/anchor"
import { PublicKey, Connection, SystemProgram }/*,KeyPair}*/ from "@solana/web3.js"
import { Buffer } from "buffer"
import { wallet } from "@/utils/solanaWallet"

import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata"
import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token"
// import { anchorStakeMint as stakeMint } from "./const";
import { IDL } from '@/idl/types/staking_program'
import { useAnchorWallet } from "solana-wallets-vue"
import { computed } from "vue"
const anchorWallet = useAnchorWallet()
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);
// const randKp= new Keypair()
const stakeMint = new PublicKey("REWLYBz1rZFS2ErKB5LEdXTYChUXBAvF2zjbizsAsjM");
const RPC_ENDPOINT_URL = "https://api.devnet.solana.com"
const preflightCommitment = 'processed'
const commitment = 'processed'
const connection = new Connection(RPC_ENDPOINT_URL, commitment)
const provider = computed(() => new anchor.AnchorProvider(connection, anchorWallet.value!, { preflightCommitment, commitment }));
anchor.setProvider(provider.value);
const programId = new PublicKey("7qwQBAxGr9c5STpZeQRDYWsYXLNRjDfrFdZ4q3vkD6Fj")
const program = new anchor.Program(IDL, programId)
// const metaplex = Metaplex.make(connection)
//     .use(keypairIdentity(randKp))
//     .use(bundlrStorage());



async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<PublicKey> {
  return (await PublicKey.findProgramAddress(
    [
      walletAddress.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      tokenMintAddress.toBuffer(),
    ],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  ))[0];
}

let stakeStatePda: any[], delegatedAuthPda: any[], NFT_MINT: PublicKey, tokenAddress: any, masterEdition: any
async function getAddresses(nft: any) {
  NFT_MINT = new PublicKey(nft.mint)
  tokenAddress = await findAssociatedTokenAddress(wallet.publicKey.value!, NFT_MINT);
  masterEdition = nft.masterEditionAddress
  if (!masterEdition) {
    masterEdition = (await PublicKey.createProgramAddress([Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), NFT_MINT.toBuffer(), Buffer.from('edition')], programId))
  }
  delegatedAuthPda = await PublicKey.findProgramAddress(
    [Buffer.from("authority")],
    programId
  )

  stakeStatePda = await PublicKey.findProgramAddress(
    [wallet.publicKey.value!.toBuffer(), tokenAddress.toBuffer()],
    programId
  )
  return
}
export async function stakeNFT(nft: any, user: PublicKey) {
  try {
    console.log(" user:", wallet.publicKey.value!.toBase58())
    await getAddresses(nft)
    // nft = await metaplex.nfts().findByMint({ mintAddress: mint} ).run();
    console.log("delegated authority pda: ", delegatedAuthPda[0].toBase58())
    console.log("stake state pda: ", stakeStatePda[0].toBase58())
    console.log("token address:", tokenAddress.toBase58())
    console.log("NFT_MINT:", NFT_MINT.toBase58())
    console.log("master edition:", masterEdition.toBase58())
    // const userWallet = wallet.publicKey.value!
    const txid = await program.methods
      .stake()
      .accounts({
        user: user,
        nftTokenAccount: tokenAddress,
        nftMint: NFT_MINT,
        nftEdition: masterEdition,
        stakeState: stakeStatePda[0],
        programAuthority: delegatedAuthPda[0],
        tokenProgram: TOKEN_PROGRAM_ID,
        metadataProgram: METADATA_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc()
    console.log("Stake tx:")
    console.log(`https://explorer.solana.com/tx/${txid}?cluster=devnet`)
  } catch (err) {
    console.log(err)
    return
  }
}

export async function redeemRewards(nft: any) {
  try {

    await getAddresses(nft)
    // redeeming rewards
    let mintAuth = await PublicKey.findProgramAddress(
      [Buffer.from("mint")],
      programId
    )
    let userStakeAta = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet.publicKey.value!,
      stakeMint,
      wallet.publicKey.value
    )

    const redeemTxid = await program.methods
      .redeem()
      .accounts({
        user: wallet.publicKey.value!,
        nftTokenAccount: nft.tokenAddress,
        stakeState: stakeStatePda[0],
        stakeMint: stakeMint,
        stakeAuthority: mintAuth[0],
        userStakeAta: userStakeAta.address,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc()

    console.log("Redeem tx:")
    console.log(`https://explorer.solana.com/tx/${redeemTxid}?cluster=devnet`)
  } catch (err) {
    console.log(err)
    return
  }
}

export async function unstakeNFT(nft: any) {
  try {
    await getAddresses(nft)

    const unstakeTxid = await program.methods
      .unstake()
      .accounts({
        user: wallet.publicKey.value!,
        nftTokenAccount: nft.tokenAddress,
        nftMint: nft.mintAddress,
        nftEdition: masterEdition[0],
        stakeState: stakeStatePda[0],
        programAuthority: delegatedAuthPda[0],
        tokenProgram: TOKEN_PROGRAM_ID,
        metadataProgram: METADATA_PROGRAM_ID,
      })
      .rpc()

    console.log("Unstake tx:")
    console.log(`https://explorer.solana.com/tx/${unstakeTxid}?cluster=devnet`)
  } catch (err) {
    console.log(err)
    return
  }
}