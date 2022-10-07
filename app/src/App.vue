<script setup lang="ts">
import AppNav from '@/components/AppNav.vue'
// import { ref, watchEffect, Ref } from 'vue'

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