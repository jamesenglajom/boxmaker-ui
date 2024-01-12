// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["@/assets/css/uiv3-1.scss"],
  ssr: true,
  modules: ['@nuxt/ui', // 'vue-fomantic-ui'
    '@nuxt/devtools', "@nuxt/image", "floating-vue/nuxt",
    '@pinia/nuxt', '@vueuse/nuxt', 'dayjs-nuxt', "nuxt-lodash"],

  runtimeConfig: {
    // The private keys which are only available within server-side
    // Keys within public, will be also exposed to the client-side
    public: {
      scBaseUrl: "",
      scKey: "",
      scKeyPostfix: "",
      scRequest: "",
    }
  }
})

