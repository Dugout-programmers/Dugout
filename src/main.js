import App from "./App.vue";
import router from "./router";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { useKakao } from "vue3-kakao-maps/@utils";
import { QuillEditor } from "@vueup/vue-quill";
import VCalendar from "v-calendar";
import "v-calendar/style.css";
import "./styles/index.css";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

useKakao("399b05e95de82f5d07a8fd56ca2ecba7", [
  "clusterer",
  "services",
  "drawing",
]);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);
app.component("QuillEditor", QuillEditor);
app.use(pinia);
app.use(router);
app.use(VCalendar, {});

app.mount("#app");
