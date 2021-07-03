<template>
  <div id="myProfile">
    <Loading v-model:active="isLoading" />
    <div class="profile">
      <h1>Minha Conta</h1>
      <form @submit.prevent="updateProfile">
        <label>Nome Completo</label>
        <input type="text" v-model="name" required minlength="3" />
        <button type="submit">Atualizar Perfil</button>
      </form>
      <button class="button logout" @click="logOut">Sair</button>
    </div>
  </div>
</template>

<script lang="ts">
import firebase from "../services/firebaseConnection";
import { createToast } from "mosha-vue-toastify";
import Loading from "vue-loading-overlay";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    Loading,
  },
})
export default class Dashboard extends Vue {
  isLoading = false;
  user = firebase.auth().currentUser;
  name = this.user?.displayName;

  async updateProfile(): Promise<void> {
    if (!this.name) {
      createToast(
        {
          title: "O nome é obrigatório",
        },
        {
          type: "warning",
        }
      );
      return;
    }

    this.isLoading = true;

    await this.user?.updateProfile({
      displayName: this.name,
    });

    const posts = await firebase
      .firestore()
      .collection("posts")
      .where("user_id", "==", this.user?.uid)
      .get();

    posts.forEach(async (post) => {
      await firebase.firestore().collection("posts").doc(post.id).update({
        user_name: this.name,
      });
    });

    this.isLoading = false;
    this.$router.push("/");
  }

  async logOut(): Promise<void> {
    const confirm = window.confirm("Você realmente deseja sair?");

    if (confirm) {
      await firebase.auth().signOut();
      this.$router.push("/login");
    }
  }
}
</script>

<style scoped>
h1 {
  text-align: center;
  color: #fff;
}

.profile {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  margin-top: 65px;
  background: #4c5059;
  border-radius: 5px;
}

.profile a {
  margin-top: 20px;
  text-decoration: none;
  color: #fff;
  cursor: pointer;
}

form {
  display: flex;
  flex-direction: column;
  margin: 0px 25px;
}

label {
  margin-bottom: 5px;
  color: #fff;
}

input {
  margin-bottom: 10px;
  height: 14px;
  width: 300px;
  font-size: 14px;
  padding: 10px;
  outline: none;
  border: 0;
  background: #fff;
}

button {
  height: 35px;
  border: 0;
  background-color: #01579b;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  outline: none;
  cursor: pointer;
}

button:hover {
  background-color: #014982;
}

button.logout {
  height: 35px;
  width: 320px;
  border: 0;
  background-color: #e36d6d;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  outline: none;
  cursor: pointer;
  margin-top: 5px;
}

button.logout:hover {
  background-color: #db4242;
}
</style>
