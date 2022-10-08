<script setup lang="ts">

import { ref, watchEffect } from 'vue';
// import { verifyNFT } from '@/utils/verifyNFT'
import { WalletMultiButton } from 'solana-wallets-vue'
import { useQuasar } from 'quasar';
import { wallet } from '@/utils/solanaWallet'



// const verified = ref(false)
const $q = useQuasar();


const rightDrawerOpen = ref(false)
// const searchToolbar = ref(false);
function toggleRightDrawer() {
    rightDrawerOpen.value = !rightDrawerOpen.value
    return
}
const appTitle = "Staking Site"





watchEffect(async () => {
    console.log()
})



</script>
<template>
    <q-header elevated class=" header bg-primary text-white" height-hint="98">
        <q-toolbar app dark>
            <q-toolbar-title>
                <q-btn ripple flat dark to="/">
                    <q-avatar class="white-shadow">
                        <q-avatar>
                            <img src="../assets/logo.png">
                        </q-avatar>
                    </q-avatar>
                    <label class="text-h5" v-if="$q.screen.gt.sm">
                        {{ appTitle }}
                    </label>
                </q-btn>
                <q-chip outline size="sm" dark>Beta</q-chip>
            </q-toolbar-title>
            <WalletMultiButton dark />
            <q-btn align="right" dense flat round icon="menu" @click="toggleRightDrawer" />
        </q-toolbar>
    </q-header>
    {{ wallet.connected}}
</template>
<style scoped>
.holder {
    color: green;
    margin-left: 3px;
    font-size: 1.25rem;
    font-variant: small-caps;
    font-weight: 600;

}

.white-shadow {
    box-shadow: 0px 0px 5px 2px rgba(255, 255, 255, 0.5), 0px 0px 0px 2px rgba(0, 0, 0, 0.1);
    margin-right: .5rem;
}

.username-container {
    flex: 1;
    text-align: right;
}

.no-holder {
    color: #ff7f50;
    margin-left: 3px;
    font-size: 1.25rem;
    font-variant: small-caps;
    font-weight: 600;

}

.highlight {
    background-color: #ff7f50;
}


#tabs {
    overflow-x: auto;
}

.drawer-wrapper {
    background-color: #ffffff55;
    max-height: 500px;
    overflow-y: auto;
    padding: 1rem 0;
}

.drawer {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    gap: 1rem 2rem;

}

.workAs {
    flex: 0 0 100%;
}

.wag-btn--container {
    display: flex;
}

.wag-btn {
    margin: 1rem auto;
    /* flex: 0 0 100%; */
    align-items: center;
    justify-self: center;
    width: 80%;
    background-color: #1D1D1D;
    /* box-shadow: 0px 0px 5px 2px rgba(255, 255, 255, 0.5), 0px 0px 0px 2px rgba(0, 0, 0, 0.1); */
}

.container {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-evenly;
    min-height: 100px;
    /* gap: 2rem 2rem; */
}

.button-container {
    display: flex;
    width: 100%;
    flex-flow: row wrap;
}

.drawer-btn {
    flex: 1 0 100%;
}

.absolute-bottom {
    background-color: unset;
}

.nft-card {
    flex: 0 0 20%;
    /* min-width: 250px; */
    max-width: 300px;
}

.auth-level-info {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
}

.roles-page-title {
    font-weight: 800;
    padding-bottom: 0;
}

.roles-container {
    width: 80%;
    margin: 0 auto;
}

.role-title {
    font-weight: 600;
    font-size: 1rem;
    margin: 0;
    padding-bottom: 0;
    text-decoration: underline;
}

.role-description {
    font-size: .75rem;
    margin-top: 0;
    margin-bottom: 2rem;
}

.search-toolbar {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-evenly;
}

.searchBar-span {
    min-width: 200px;
}

.truncate {
    font-size: calc(6px + .25vw);
    width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.search-toolbar .username-container {
    flex: 0 0 175px;
    min-width: 168px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
}

#search-btn {
    position: absolute;
    bottom: 2%;
    right: 1.5rem;
    margin: 2rem auto
}
</style>