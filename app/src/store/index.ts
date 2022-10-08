import { createStore } from 'vuex'
import { Ref, ref } from 'vue'
import { NFT_META } from '@/utils/verifyNFT'

type Creator =
  { address: string }
type User = {
  tokens: NFT_META[];
  verifiedWallet: boolean;
}
export interface State {
  user: User
}

export default createStore({
  state: {
    user: {
      tokens: <any>[],
      verifiedWallet: false,
    }
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    setVerifiedWallet(context, status){
      context.state.user.verifiedWallet = status;
    },
    updateNFTMeta(context, nfts) {
      if (nfts.length === 0) {
        context.state.user.tokens = []
      }
      const nftMeta: Ref<NFT_META[]> = ref([])

      nfts.forEach(async (nft: {
        data: {
          creators: Creator[],
          uri: string;
        };
        updateAuthority: string;
        mint: string;
        key: number
      }) => {
        const res = await fetch(nft.data.uri)
        const data = await res.json()
        let update = { ...data, ['mint']: nft.mint, ['key']: nft.key }
        if (nft.data.creators) {
          console.log(nft.data.creators)
          update = { ...update, ['creator_id']: nft.data.creators[0].address }
        }
        nftMeta.value = [...nftMeta.value, update]
        context.state.user.tokens = nftMeta.value
      })
    },
    logout(context) {
      context.state.user.tokens = []
    }
  },
  modules: {
  }
})
