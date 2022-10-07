import * as anchor from "@project-serum/anchor"
import { Program } from "@project-serum/anchor"
import { StakingProgram } from "../target/types/staking_program"
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js"
import {
  Metaplex,
  bundlrStorage,
  keypairIdentity,
} from "@metaplex-foundation/js"
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata"
import { getAssociatedTokenAddress, createMint, TOKEN_PROGRAM_ID } from "@solana/spl-token"

// // MY WALLET SETTING
// const id_json_path = require("os").homedir() + "/.config/solana/test.json"
// const secret = Uint8Array.from(
//   JSON.parse(require("fs").readFileSync(id_json_path))
// )
// const wallet = Keypair.fromSecretKey(secret as Uint8Array)

// // Configure the client to use the local cluster.
// anchor.setProvider(anchor.AnchorProvider.env())
// let envProvider = anchor.AnchorProvider.env()
// const provider = new anchor.AnchorProvider(
//   envProvider.connection,
//   new anchor.Wallet(wallet),
//   envProvider.opts
// )
// let connection = provider.connection
// const program = anchor.workspace.StakingProgram as Program<StakingProgram>

describe("anchor-nft-staking", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env())
  const connection = anchor.getProvider().connection
  const program = anchor.workspace.StakingProgram as Program<StakingProgram>
  const wallet = anchor.workspace.StakingProgram.provider.wallet

  let delegatedAuthPda: PublicKey
  let stakeStatePda: PublicKey
  let nft: any
  let mintAuth: PublicKey
  let mint: PublicKey
  let tokenAddress: PublicKey

  before(async () => {
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet.payer))
      .use(bundlrStorage())

    nft = await metaplex
      .nfts()
      .create({
        uri: "https://arweave.net/IZsSX7Gaz1ufSWxjCFLzDMojWjRxBV0FK76r8PVtkio",
        name: "Test nft",
        sellerFeeBasisPoints: 0,
      })
      .run()

    console.log("nft metadata pubkey: ", nft.metadataAddress.toBase58())
    console.log("nft token address: ", nft.tokenAddress.toBase58());
    [delegatedAuthPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("authority")],
      program.programId
    );
    [stakeStatePda] = await anchor.web3.PublicKey.findProgramAddress(
      [wallet.publicKey.toBuffer(), nft.tokenAddress.toBuffer()],
      program.programId
    );
    [mintAuth] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("mint")],
      program.programId
    );
    mint = new PublicKey("REWLYBz1rZFS2ErKB5LEdXTYChUXBAvF2zjbizsAsjM");
    console.log("User:", wallet.publicKey.toBase58())
    console.log("delegated authority pda: ", delegatedAuthPda.toBase58())
    console.log("stake state pda: ", stakeStatePda.toBase58());
    console.log("Mint pubkey: ", mint.toBase58())
    console.log("Mint Auth:", mintAuth.toBase58())
    console.log("NFT Mint Address:", nft.mintAddress.toBase58())
    console.log("MasterEdition Address:", nft.masterEditionAddress.toBase58())
    // console.dir(nft)
    console.log("NFT Token Address:", nft.tokenAddress.toBase58())
    console.log("tokenProgram:", TOKEN_PROGRAM_ID.toBase58())
    console.log("metadataProgram:", METADATA_PROGRAM_ID.toBase58())
    console.log("systemProgram:", SystemProgram.programId.toBase58())
    tokenAddress = await getAssociatedTokenAddress(mint, wallet.publicKey)
  })

  it("Stake nft!", async () => {
    console.log("Running first test")
    // Add your test here.
    const txid = await program.methods
      .stake()
      .accounts({
        user: wallet.publicKey, // FiVbVHE9tk3n9cbKaUZXCskCDyptWg6KxgipG8uthXBd
        nftTokenAccount: nft.tokenAddress, //FKn5VLQmbGBVUjeKomTLJLCohRhoVXBRgVmbH3Uw68hG
        nftMint: nft.mintAddress, // GvGJmDL6egbFAvuRQdW9yjVRtruCa1Lq7LJGLV6RX6S5
        nftEdition: nft.masterEditionAddress, //J8ZqKCgtyC61UWznhTuqwRTV22d7c494UCb1Av72poR9
        stakeState: stakeStatePda, // CYrdnB1J2FUZWsMFQ9zG2PRywR2VcdQMGVWotx6UruRt
        programAuthority: delegatedAuthPda, //3D6Y1F8kahK4JUCrhLagimgBnUSyZBDwZvTjCyQbNUMv
        tokenProgram: TOKEN_PROGRAM_ID, //TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
        metadataProgram: METADATA_PROGRAM_ID,//metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s
        systemProgram: SystemProgram.programId,//11111111111111111111111111111111
      })
      .rpc()
    console.log("Stake tx:")
    console.log(`https://explorer.solana.com/tx/${txid}?cluster=devnet`)

    const stateState = await program.account.userStakeInfo.fetch(stakeStatePda)
    console.log(stateState.stakeState)
  })
});

//   it("UnStake nft!", async () => {
//     console.log("Running first test")
//     // Add your test here.
//     const txid = await program.methods
//       .unstake()
//       .accounts({
//         // user: wallet.publicKey,
//         nftTokenAccount: nft.tokenAddress,
//         nftMint: nft.mintAddress,
//         nftEdition: nft.masterEditionAddress,
//         // stakeState: stakeStatePda,
//         // programAuthority: delegatedAuthPda,
//         // tokenProgram: TOKEN_PROGRAM_ID,
//         metadataProgram: METADATA_PROGRAM_ID,
//       })
//       .rpc()

//     console.log("Stake tx:")
//     console.log(`https://explorer.solana.com/tx/${txid}?cluster=devnet`)

//     const stateState = await program.account.userStakeInfo.fetch(stakeStatePda)
//     console.log(stateState.stakeState)
//   })

//   it("Stake nft again!", async () => {
//     console.log("Running first test")
//     // Add your test here.
//     const txid = await program.methods
//       .stake()
//       .accounts({
//         user: wallet.publicKey,
//         nftTokenAccount: nft.tokenAddress,
//         nftMint: nft.mintAddress,
//         nftEdition: nft.masterEditionAddress,
//         stakeState: stakeStatePda,
//         programAuthority: delegatedAuthPda,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         metadataProgram: METADATA_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//       })
//       .rpc()
//     console.log("Stake tx:")
//     console.log(`https://explorer.solana.com/tx/${txid}?cluster=devnet`)
//   })

//   it("Stake Redeem Unstake", async () => {
//     console.log("Running first test")
//     // Add your test here.
//     const txid = await program.methods
//       .stake()
//       .accounts({
//         user: wallet.publicKey,
//         nftTokenAccount: nft.tokenAddress,
//         nftMint: nft.mintAddress,
//         nftEdition: nft.masterEditionAddress,
//         stakeState: stakeStatePda,
//         programAuthority: delegatedAuthPda,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         metadataProgram: METADATA_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//       })
//       .rpc()
//     console.log("Stake tx:")
//     console.log(`https://explorer.solana.com/tx/${txid}?cluster=devnet`)

//     console.log("Sleeping for 3 sec...")
//     await new Promise((resolve) => setTimeout(resolve, 3000))

//     const redeemTxid = await program.methods
//       .redeem()
//       .accounts({
//         user: wallet.publicKey,
//         nftTokenAccount: nft.tokenAddress,
//         stakeState: stakeStatePda,
//         stakeMint: mint,
//         stakeAuthority: mintAuth,
//         userStakeAta: tokenAddress,
//         tokenProgram: TOKEN_PROGRAM_ID,
//       })
//       .rpc()

//     console.log("Redeem tx:")
//     console.log(`https://explorer.solana.com/tx/${redeemTxid}?cluster=devnet`)

//     console.log("Sleeping for 1 sec...")
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     // const redeemTxid2 = await program.methods
//     //   .redeem()
//     //   .accounts({
//     //     // user: wallet.publicKey,
//     //     nftTokenAccount: nft.tokenAddress,
//     //     // stakeState: stakeStatePda,
//     //     stakeMint: mint,
//     //     // stakeAuthority: mintAuth,
//     //     userStakeAta: tokenAddress,
//     //     // tokenProgram: TOKEN_PROGRAM_ID,
//     //   })
//     //   .rpc()

//     // console.log("Redeem tx:")
//     // console.log(`https://explorer.solana.com/tx/${redeemTxid2}?cluster=devnet`)

//     const unstakeTxid = await program.methods
//       .unstake()
//       .accounts({
//         // user: wallet.publicKey,
//         nftTokenAccount: nft.tokenAddress,
//         nftMint: nft.mintAddress,
//         nftEdition: nft.masterEditionAddress,
//         // stakeState: stakeStatePda,
//         // programAuthority: delegatedAuthPda,
//         // tokenProgram: TOKEN_PROGRAM_ID,
//         metadataProgram: METADATA_PROGRAM_ID,
//       })
//       .rpc()

//     console.log("Unstake tx:")
//     console.log(`https://explorer.solana.com/tx/${unstakeTxid}?cluster=devnet`)
//   })
// })
