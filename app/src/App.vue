<script setup lang="ts">
import AppNav from '@/components/AppNav.vue'
import { mint } from '@/utils/mintNewNFT'

function handleMint() {
  mint()
  return
}

</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <AppNav />
    <q-btn label="mint" @click="handleMint()" />
    <RouterView />
  </q-layout>
</template>
<style scoped>
.nft {
  flex: 0 0 25%;
}
</style>