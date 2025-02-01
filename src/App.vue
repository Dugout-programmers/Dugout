<script setup>
import { RouterView } from "vue-router";
import CheerSong from "./components/header/CheerSong.vue";
// import Header from "./components/ui/Header.vue";
</script>

<template>
  <!-- <Header /> -->
  <RouterView />
  <CheerSong class="fixed bottom-[30px] left-[20px] transform z-40" />
</template>

<style scoped></style>
