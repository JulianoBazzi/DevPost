<template>
  <div id="profile">
    <Loading v-model:active="isLoading" />
    <div>
      <div class="profileHeader">
        <h2>sdsdff</h2>
        <span
          >Já fez <strong>{{ posts.length }}</strong> postagens em nossa
          plataforma.</span
        >
      </div>
      <div class="postarea">
        <article class="post">
          <p>Este é um post de exemplo...</p>
          <div class="action-post">
            <button>Ver publicação completa</button>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import firebase from "firebase";
import IPostDTO from "../dtos/IPostDTO";
import Loading from "vue-loading-overlay";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    Loading,
  },
  props: {
    userId: String,
  },
})
export default class Profile extends Vue {
  isLoading = true;
  showModal = false;
  userId!: string;
  user: firebase.User | null = null;
  posts: IPostDTO[] = [];
  selectedPost: IPostDTO | null = null;

  async created(): Promise<void> {
    this.user = null;

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
      });

    this.isLoading = false;
  }
}
</script>
