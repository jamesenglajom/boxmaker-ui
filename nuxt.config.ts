// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr:true,
  modules: ['@nuxt/ui', // 'vue-fomantic-ui'
  '@nuxt/devtools', "@nuxt/image"],
  // css:['fomantic-ui-css/semantic.min.css']
  // vue: {  
  //   compilerOptions: {
  //     isCustomElement: (tag) => ['BoxTags'].includes(tag),
  //   },
  // }
})