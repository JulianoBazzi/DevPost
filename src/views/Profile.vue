<template>
  <div id="profile">
    <Loading v-model:active="isLoading" />
    <div v-if="!isLoading">
      <div class="profileHeader">
        <h2>{{ userName }}</h2>
        <span
          >Já fez <strong>{{ posts.length }}</strong>
          {{ posts.length > 1 ? "postagens" : "postagem" }} em nossa
          plataforma.</span
        >
      </div>
      <div class="postarea">
        <article class="post" v-for="post in posts" :key="post.id">
          <h1>{{ post.autor }}</h1>
          <p>{{ postLength(post.content) }}</p>
          <div class="action-post">
            <button @click="togglePostModal(post)">
              Ver publicação completa
            </button>
          </div>
        </article>
      </div>
    </div>
    <Modal v-if="showModal" :post="selectedPost" @close="togglePostModal()" />
  </div>
</template>

<script lang="ts">
import firebase from "firebase";
import IPostDTO from "../dtos/IPostDTO";
import Loading from "vue-loading-overlay";
import { Options, Vue } from "vue-class-component";
import Modal from "@/components/Modal.vue";

@Options({
  components: {
    Loading,
    Modal,
  },
  props: {
    userId: String,
  },
})
export default class Profile extends Vue {
  isLoading = true;
  showModal = false;
  userId!: string;
  userName = "";
  posts: IPostDTO[] = [];
  selectedPost: IPostDTO | null = null;

  async created(): Promise<void> {
    await firebase
      .firestore()
      .collection("posts")
      .where("user_id", "==", this.userId)
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

        this.userName = this.posts[0].user_name;
        this.isLoading = false;
      });
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

<style scoped></style>
