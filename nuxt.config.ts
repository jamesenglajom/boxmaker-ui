// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr:true,
  modules: ['@nuxt/ui', // 'vue-fomantic-ui'
  '@nuxt/devtools', "@nuxt/image", "floating-vue/nuxt", 
  '@pinia/nuxt',],
  nitro:{
    esbuild: {
      options: {
        target: 'esnext'
      }
    }
  }
})