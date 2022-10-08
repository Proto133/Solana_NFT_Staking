const { defineConfig } = require('@vue/cli-service')
const secret = require('../test_staking.json')
const { Keypair } = require('@solana/web3.js')
module.exports = defineConfig({

  chainWebpack: config => {
    config.plugin('define').tap(args => {
      args[0]['process.env'].SECRET = Keypair.fromSecretKey(Uint8Array.from(secret));
      return args;
    });
  },

  configureWebpack: {
    resolve: {
      fallback: {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "path": require.resolve("path-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "Buffer": require.resolve("buffer/"),
        "buffer": require.resolve("buffer/"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify"),
        "url": require.resolve("url")

      }
    }
  },
  transpileDependencies: [
    'quasar'
  ],
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  }
})
