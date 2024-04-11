<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <MerchantPage />
  </div>
</template>

<script>
import MerchantPage from './components/MerchantPage.vue';

export default {
  name: 'App',
  components: {
    MerchantPage
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
