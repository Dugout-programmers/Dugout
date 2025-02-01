<script setup>
import Header from "@/components/ui/Header.vue";
import { ref, computed, watch } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { gameList } from "@/constants/index.js";

const router = useRouter();
const route = useRoute();

const games = computed(() =>
  gameList.map((game) => ({
    ...game,
    url: `/game/${game.path}`,
  }))
);

const selectedGame = ref("");

watch(
  () => route.path,
  (newPath) => {
    const currentPath = newPath.split("/").pop();
    const matchedGame = games.value.find((game) => game.path === currentPath);
    selectedGame.value = matchedGame ? matchedGame.name : "";
  },
  { immediate: true }
);

const selectGame = (game) => {
  selectedGame.value = game.name;
  router.push(game.url);
};
</script>

<template>
  <div class="flex flex-col items-center justify-start w-full min-h-screen">
    <Header />
    <div class="bg-[#070707] w-full flex-grow pt-[100px] flex flex-col">
      <div
        class="flex items-center gap-[10px] w-full flex-nowrap px-[30px] py-[17px]"
      >
        <button
          v-for="game of games"
          :key="game.name"
          @click="selectGame(game)"
          class="active:bg-white01 inline-flex items-center h-[34px] px-[10px] rounded-[10px] whitespace-nowrap gap-[10px] text-[18px] font-semibold"
          :class="{
            'bg-white01 text-black01': selectedGame === game.name,
            'bg-transparent text-white01': selectedGame !== game.name,
          }"
        >
          <img
            :src="selectedGame === game.name ? game.iconBlack : game.icon"
            class="w-[20px] h-[18px]"
          />
          <p>{{ game.name }}</p>
        </button>
      </div>
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
