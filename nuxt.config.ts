// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr:true,
  // nitro: {
  //   // baseURL: "http://localhost:3000",
  //   prerender: {
  //     crawlLinks: true,
  //     failOnError: false, 
  //   },
  // },
  modules: ['@nuxt/ui', // 'vue-fomantic-ui'
  '@nuxt/devtools', "@nuxt/image", "floating-vue/nuxt"],
  // css:['fomantic-ui-css/semantic.min.css']
  // vue: {  
  //   compilerOptions: {
  //     isCustomElement: (tag) => ['BoxTags'].includes(tag),
  //   },
  // }
})