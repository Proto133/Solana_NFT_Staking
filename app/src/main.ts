import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Quasar } from 'quasar'
import quasarUserOptions from '@/quasar-user-options'
import 'solana-wallets-vue/styles.css'
import '@/styles/main.css'
// import {walletOptions} from './utils/solanaWallet'
// import SolanaWallets from 'solana-wallets-vue'

createApp(App)
    .use(Quasar, quasarUserOptions)
    // .use(SolanaWallets, walletOptions)
    .use(store)
    .use(router)
    .mount('#app')
