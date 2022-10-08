<script setup lang="ts">
import AppNav from '@/components/AppNav.vue'
// import { mint } from '@/utils/mintNewNFT'
// import { ref } from 'vue'

</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <AppNav />
    <RouterView />

  </q-layout>
</template>
<style scoped>
.nft {
  flex: 0 0 25%;
}
</style>