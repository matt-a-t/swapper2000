// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/index.css'],
  runtimeConfig: {
    turso: {
      databaseUrl: "",
      authToken: "",
    },
    public: {
      url: "",
    },
  },
})
