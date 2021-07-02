<template>
  <div id="app">
    <Header />
    <router-view />
  </div>
</template>

<script lang="ts">
import "vue-loading-overlay/dist/vue-loading.css";
import "mosha-vue-toastify/dist/style.css";
import { Options, Vue } from "vue-class-component";
import Header from "@/components/Header.vue"; // @ is an alias to /src

@Options({
  components: {
    Header,
  },
})
export default class App extends Vue {}
</script>

<style scoped>
#app {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
