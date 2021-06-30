<template>
  <div id="header">
    <router-link to="/">DevPost</router-link>
    <router-link to="/dashboard"><button>Dashboard</button></router-link>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class Header extends Vue {}
</script>

<style scoped>
#header {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 60px;
  background-color: #202225;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

#header a {
  text-decoration: none;
  font-size: 30px;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
}

button {
  cursor: pointer;
  border: 0;
  color: #fff;
  background: transparent;
  padding: 5px 15px;
  outline: none;
  font-weight: bold;
}
</style>
