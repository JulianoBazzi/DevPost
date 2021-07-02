import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueLoading from "vue-loading-overlay";
import firebase from "./services/firebaseConnection";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let app: any;
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)
      .use(router)
      .use(VueLoading, {
        isFullPage: true,
        canCancel: false,
        color: "#01579b",
        lockScroll: true,
      })
      .mount("#app");
  }
});
