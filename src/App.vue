<script setup>
import { RouterView } from "vue-router";
import CheerSong from "./components/common/CheerSong.vue";
// import { useAuthStore } from "./stores/auth";
// import { onMounted } from "vue";

// const authStore = useAuthStore();

// onMounted(async () => {
//   await authStore.initUser();
//   authStore.setupAuthListener();
// });
</script>

<template>
  <RouterView />
  <CheerSong class="fixed bottom-[30px] left-[20px] transform z-40" />
</template>

<style scoped></style>
