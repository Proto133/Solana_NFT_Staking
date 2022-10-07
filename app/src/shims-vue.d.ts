/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@metaplex-foundation/mpl-token-metadata'
declare module '@solana/spl-token'
declare module '@/quasar-user-options'
declare module '@/idl/staking_program.json'