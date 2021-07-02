<template>
  <div id="header">
    <router-link to="/">DevPost</router-link>
    <div v-if="isAuthenticated">
      <router-link to="/dashboard"><button>Dashboard</button></router-link>
      <button @click="logOut">Sair</button>
    </div>
  </div>
  <div id="emailAlert" v-if="!isVerifidEmail">
    <i class="material-icons-outlined">report_problem</i>
    <label
      >Ops... Seu e-mail ainda não verificado, confira a sua caixa de entrada ou
      lixo eletrônico (spam).</label
    >
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import firebase from "../services/firebaseConnection";

export default class Header extends Vue {
  isVerifidEmail = true;
  isAuthenticated = false;

  created(): void {
    const user = firebase.auth().currentUser;
    if (user) {
      this.isAuthenticated = true;
      this.isVerifidEmail = user.emailVerified;
    }
  }

  async logOut(): Promise<void> {
    const confirm = window.confirm("Você realmente deseja sair?");

    if (confirm) {
      await firebase.auth().signOut();
      localStorage.removeItem("user");
      this.isVerifidEmail = true;
      this.isAuthenticated = false;
      this.$router.push("/login");
    }
  }
}
</script>

<style scoped>
#header {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 60px;
  background-color: #01579b;
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

#emailAlert {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  background-color: #fffaed;
  border: 1px solid #ffeeba;
  color: #856404;
}
</style>
