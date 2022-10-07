<script setup lang="ts">
import { ref, watchEffect, Ref } from 'vue'
import AppNav from '@/components/AppNav.vue'
import { wallet } from '@/utils/solanaWallet';
import { verifyNFT } from './utils/verifyNFT';
import { stakeNFT } from '@/utils/programCalls';
// import { testStakeProgram, testUnstakeNFT, testRedeemRewards } from '@/utils/anchor-program'

const userNFTs: Ref<any[] | undefined | null> = ref(null)

async function handleStakeNFT(nft: any) {
  await stakeNFT(nft)
}
async function handleRedeem(nft: any) {
  // await testRedeemRewards(nft)
  console.log("REDEEM ", nft.mint)
}

async function handleUnstake(nft: any) {
  // await testUnstakeNFT(nft)
  console.log("UNSTAKE ", nft.mint)
}
async function setUserNFTs() {
  userNFTs.value = await verifyNFT(wallet.publicKey.value!)
}

watchEffect(async () => {
  if (!userNFTs.value && wallet.publicKey.value) {
    setUserNFTs();
  }

})
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <AppNav />

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
  </q-layout>
</template>
<style scoped>
.nft {
  flex: 0 0 25%;
}
</style>