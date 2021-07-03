<template>
  <div id="login">
    <Loading v-model:active="isLoading" />

    <!-- Entrar -->
    <div class="loginArea" v-if="login">
      <h1>Entrar</h1>
      <form @submit.prevent="handleLogin">
        <label>Email</label>
        <input type="email" v-model="email" required />
        <label>Senha</label>
        <input type="password" v-model="password" minlength="6" required />
        <button type="submit">Acessar</button>
      </form>
      <a @click="toggleButton">Deseja criar uma conta? Clique aqui.</a>
    </div>

    <!-- Cadastrar -->
    <div class="loginArea" v-else>
      <h1>Cadastrar</h1>
      <form @submit.prevent="handleRegister">
        <label>Nome Completo</label>
        <input type="text" v-model="name" required minlength="3" />
        <label>Email</label>
        <input type="email" v-model="email" required />
        <label>Senha</label>
        <input type="password" v-model="password" minlength="6" required />
        <button type="submit">Cadastrar</button>
      </form>
      <a @click="toggleButton">Já possui uma conta? Clique aqui.</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { createToast } from "mosha-vue-toastify";
import Loading from "vue-loading-overlay";
import firebase from "../services/firebaseConnection";

@Options({
  components: {
    Loading,
  },
})
export default class Login extends Vue {
  name = "";
  email = "";
  password = "";
  login = true;
  isLoading = false;

  created(): void {
    if (firebase.auth().currentUser) {
      this.$router.push("/");
    }
  }

  toggleButton(): void {
    this.login = !this.login;
    this.name = "";
    this.email = "";
    this.password = "";
  }

  async handleLogin(): Promise<void> {
    try {
      if (!this.email || !this.password) {
        createToast(
          {
            title: "É necessário preencher todos os campos",
          },
          {
            type: "warning",
          }
        );
        return;
      }

      this.isLoading = true;
      const { user } = await firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password);

      if (!user?.emailVerified) {
        await user?.sendEmailVerification();
      }

      this.isLoading = false;
      this.$router.push("/");
    } catch (error) {
      this.isLoading = false;
      createToast(
        {
          title: "Erro ao efetuar o login",
          description: error.message,
        },
        {
          type: "warning",
        }
      );
    }
  }

  async handleRegister(): Promise<void> {
    if (!this.name || !this.email || !this.password) {
      createToast(
        {
          title: "É necessário preencher todos os campos",
        },
        {
          type: "warning",
        }
      );
      return;
    }

    try {
      this.isLoading = true;
      const { user } = await firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password);

      await user?.updateProfile({
        displayName: this.name,
      });

      await user?.sendEmailVerification();

      this.isLoading = false;
      this.$router.push("/");
    } catch (error) {
      this.isLoading = false;
      createToast(
        {
          title: "Erro ao efetuar o cadastro",
          description: error.message,
        },
        {
          type: "warning",
        }
      );
    }
  }
}
</script>

<style scoped>
h1 {
  text-align: center;
  color: #fff;
}

.loginArea {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  margin-top: 65px;
  background: #4c5059;
  border-radius: 5px;
}

.loginArea a {
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
</style>
