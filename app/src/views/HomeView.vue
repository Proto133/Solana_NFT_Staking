    
<script setup lang="ts">
import { ComputedRef, watchEffect, computed, ref } from 'vue'
// import AppNav from '@/components/AppNav.vue'
import store, { State } from '@/store'
import { wallet } from '@/utils/solanaWallet';
import { verifyNFT, verifyWallet } from '@/utils/verifyNFT';
import { stakeNFT } from '@/utils/programCalls';
import { useQuasar } from 'quasar'

const $q = useQuasar()
const walletVerified = ref(false)

async function handleVerifyWallet() {
  const walletStatus = await verifyWallet();
  if (!walletStatus) {
    $q.notify({
      type: 'negative',
      icon: 'warning',
      message: 'Oh No!',
      caption: 'Wallet not verified',
      position: 'top'

    })
  }

  return walletVerified.value = walletStatus
}
const userNFTs: ComputedRef<State["user"]["tokens"]> = computed(() => store.state.user.tokens)

async function handleStakeNFT(nft: any) {
  await stakeNFT(nft, wallet.publicKey.value!)
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
  if (!wallet.connected.value) {
    store.dispatch('logout')
  }
})
</script>
<template>
  <q-page-container>
    <h2>{{wallet.publicKey.value?.toBase58()}}</h2>

    <section id="nfts" v-if="walletVerified">
      <div v-if="userNFTs" class="flex justify-between">
        <q-card v-for="nft in userNFTs" :key="nft.mint">
          <q-img class="nft" :src="nft.image" />
          <q-btn label="Stake" @click="handleStakeNFT(nft)"></q-btn>
          <q-btn label="Redeem" @click="handleRedeem(nft)"></q-btn>
          <q-btn label="Unstake" @click="handleUnstake(nft)"></q-btn>
        </q-card>
      </div>
    </section>
    <q-btn v-else label="Verify Wallet" flat @click="handleVerifyWallet()" />
  </q-page-container>
</template>
