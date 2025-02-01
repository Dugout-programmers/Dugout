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

// 현재 경로에서 게임 타입을 확인하는 함수 추가
const getCurrentGameType = (path) => {
  // 퀴즈 관련 모든 경로
  if (path.includes("/game/quizselect")) {
    return "quiz";
  }
  // 토너먼트 관련 모든 경로
  if (path.includes("/game/tournamentselect")) {
    return "tournament";
  }
  // 기타 게임
  const gamePath = path.split("/game/")[1];
  return gamePath;
};

watch(
  () => route.path,
  (newPath) => {
    const gameType = getCurrentGameType(newPath);
    const matchedGame = games.value.find((game) => game.path === gameType);
    if (matchedGame) {
      selectedGame.value = matchedGame.name;
    }
  },
  { immediate: true }
);

const selectGame = (game) => {
  if (game.path === "quiz") {
    selectedGame.value = game.name;
    router.push("/game/quizselect");
  } else if (game.path === "tournament") {
    selectedGame.value = game.name;
    router.push("/game/tournamentselect");
  } else {
    selectedGame.value = game.name;
    router.push(game.url);
  }
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
