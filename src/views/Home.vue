<template>
  <div id="home">
    <Loading v-model:active="isLoading" />
    <div class="newpost">
      <h2>Bem vindo(a) de volta!</h2>
      <span>Compartilhe seu dia...</span>
      <textarea
        placeholder="O que está fazendo hoje?"
        rows="15"
        v-model="input"
      ></textarea>
      <button @click="createPost">Compartilhar</button>
    </div>
    <div class="postarea">
      <article class="post" v-for="post in posts" :key="post.id">
        <router-link :to="`/profile/${post.user_id}`"
          ><h1>{{ post.user_name }}</h1></router-link
        >
        <p>{{ postLength(post.content) }}</p>
        <div class="action-post">
          <button
            v-if="post.likes === 0"
            @click="likePost(post.id, post.likes)"
          >
            Curtir
          </button>
          <button v-else @click="likePost(post.id, post.likes)">
            {{ post.likes }} Curtida{{ post.likes > 1 ? "s" : "" }}
          </button>
          <span> | </span>
          <button @click="togglePostModal(post)">
            Ver publicação completa
          </button>
        </div>
      </article>
    </div>
    <Modal v-if="showModal" :post="selectedPost" @close="togglePostModal()" />
  </div>
</template>

<script lang="ts">
import firebase from "firebase";
import IPostDTO from "../dtos/IPostDTO";
import Loading from "vue-loading-overlay";
import { createToast } from "mosha-vue-toastify";
import { Options, Vue } from "vue-class-component";
import Modal from "@/components/Modal.vue";

@Options({
  components: {
    Loading,
    Modal,
  },
})
export default class Home extends Vue {
  input = "";
  isLoading = true;
  posts: IPostDTO[] = [];
  selectedPost: IPostDTO | null = null;
  showModal = false;

  async created(): Promise<void> {
    await firebase
      .firestore()
      .collection("posts")
      .orderBy("created", "desc")
      .onSnapshot((docs) => {
        this.posts = [];

        docs.forEach((item) => {
          this.posts.push({
            id: item.id,
            user_id: item.data().user_id,
            user_name: item.data().user_name,
            content: item.data().content,
            likes: item.data().likes,
            created: item.data().created,
          });
        });
      });
    this.isLoading = false;
  }

  postLength(value: string): string {
    if (!value) {
      return "";
    }

    if (value.length < 200) {
      return value;
    }

    return `${value.substring(0, 200)}...`;
  }

  async likePost(uid: string, likes: number): Promise<void> {
    this.isLoading = true;
    const user = firebase.auth().currentUser;
    if (user) {
      const docId = `${uid}_${user.uid}`;

      const haveLike = await firebase
        .firestore()
        .collection("likes")
        .doc(docId)
        .get();

      if (haveLike.exists) {
        await firebase
          .firestore()
          .collection("posts")
          .doc(uid)
          .update({
            updated: new Date(),
            likes: likes - 1,
          });

        await firebase.firestore().collection("likes").doc(docId).delete();
        this.isLoading = false;
        return;
      }

      await firebase.firestore().collection("likes").doc(docId).set({
        created: new Date(),
        post_id: uid,
        user_id: user.uid,
      });

      await firebase
        .firestore()
        .collection("posts")
        .doc(uid)
        .update({
          updated: new Date(),
          likes: likes + 1,
        });

      this.isLoading = false;
    }
  }

  async createPost(): Promise<void> {
    if (!this.input) {
      createToast(
        {
          title: "Opss... Você esqueceu de informar o texto",
        },
        {
          type: "warning",
        }
      );
      return;
    }

    try {
      this.isLoading = true;
      const user = firebase.auth().currentUser;
      if (user) {
        await firebase.firestore().collection("posts").add({
          created: new Date(),
          updated: new Date(),
          content: this.input,
          user_id: user.uid,
          user_name: user.displayName,
          likes: 0,
        });

        this.input = "";
        this.isLoading = false;
      }
    } catch (error) {
      this.isLoading = false;
      createToast(
        {
          title: "Erro ao compartilhar post",
          description: error.message,
        },
        {
          type: "warning",
        }
      );
    }
  }

  async togglePostModal(post: IPostDTO): Promise<void> {
    this.showModal = !this.showModal;

    if (this.showModal) {
      this.selectedPost = post;
      return;
    }

    this.selectedPost = null;
  }
}
</script>

<style scoped>
#home {
  display: flex;
  flex-direction: row;
  margin: 25px;
}

@import "./home.css";
</style>
