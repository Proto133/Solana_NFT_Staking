    
<script setup lang="ts">
import { ComputedRef, watchEffect, computed } from 'vue'
// import AppNav from '@/components/AppNav.vue'
import store, { State } from '@/store'
import { wallet } from '@/utils/solanaWallet';
import { verifyNFT } from '@/utils/verifyNFT';
import { stakeNFT } from '@/utils/programCalls';
// import { PublicKey } from '@solana/web3.js';

// import { testStakeProgram, testUnstakeNFT, testRedeemRewards } from '@/utils/anchor-program'

const userNFTs: ComputedRef<State["user"]["tokens"]> = computed(() => store.state.user.tokens)

async function handleStakeNFT(nft: any) {
  await stakeNFT(nft)
}
async function handleRedeem(nft: any) {

  console.log("REDEEM ", nft.mint)
}

async function handleUnstake(nft: any) {
  // await testUnstakeNFT(nft)
  console.log("UNSTAKE ", nft.mint)
}

watchEffect(async () => {
  console.log(userNFTs.value)
  if (!userNFTs.value.length && wallet.publicKey.value) {
    await verifyNFT(wallet.publicKey.value!)
  }
  if (!wallet.connected.value){
    store.dispatch('logout')
  }
})
</script>
<template>
  <q-page-container>
    <h2>{{wallet.publicKey.value?.toBase58()}}</h2>
    <div v-if="userNFTs" class="flex justify-between">
      <q-card v-for="nft in userNFTs" :key="nft.mint">
        <q-img class="nft" :src="nft.image" />
        <q-btn label="Stake" @click="handleStakeNFT(nft)"></q-btn>
        <q-btn label="Redeem" @click="handleRedeem(nft)"></q-btn>
        <q-btn label="Unstake" @click="handleUnstake(nft)"></q-btn>
      </q-card>
    </div>
  </q-page-container>
</template>
