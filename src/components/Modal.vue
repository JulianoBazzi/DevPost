<template>
  <div class="modal">
    <div class="container">
      <i class="material-icons-outlined" @click="$emit('close')">close</i>
      <div>
        <h2>{{ post.user_name }}</h2>
        <span v-if="post.likes > 0"
          >{{ post.likes }} Curtida{{ post.likes > 1 ? "s" : "" }}</span
        >
        <p>{{ post.content }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import IPostDTO from "../dtos/IPostDTO";

@Options({
  props: {
    post: {
      type: Object as () => IPostDTO,
    },
  },
})
export default class Modal extends Vue {}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
}

.modal .container {
  position: fixed;
  max-width: 600px;
  top: 4vh;
  bottom: 4vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.7);
  overflow: auto;
}

i {
  cursor: pointer;
  background: #121212;
  color: #fff;
  position: absolute;
  top: 15px;
  left: 15px;
}

span {
  font-style: italic;
  font-weight: bold;
  color: #121212;
}

p {
  white-space: pre-wrap;
}
</style>
