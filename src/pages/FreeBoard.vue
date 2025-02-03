<script setup>
import { getFreePostsByClub } from "@/api/supabase-api/freePost";
import GoToCreate from "@/components/common/GoToCreate.vue";
import Loading from "@/components/common/Loading.vue";
import FreeBoardPost from "@/components/freeboard/FreeBoardPost.vue";
import { teamID } from "@/constants";
import { useSearchStore } from "@/stores/searchStore";
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  watchEffect,
} from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";

const isLoading = ref(true);

const searchStore = useSearchStore();

const props = defineProps({
  team: String, // url 팀이름 불러오기
});

const route = useRoute();
const clubId = ref(teamID[props.team]); // 팀 id 가져오기

const freeboardList = ref(null);

const saveScrollPosition = () => {
  sessionStorage.setItem("freeboard-scroll", window.scrollY.toString());
};

const restoreScrollPosition = () => {
  const savedScroll = sessionStorage.getItem("freeboard-scroll");
  if (savedScroll) {
    window.scrollTo(0, parseInt(savedScroll, 10) || 0);
  }
};

// 자유 게시판 목록 가져오는 함수
const fetchFreeboard = async () => {
  try {
    const data = await getFreePostsByClub(clubId.value);
    freeboardList.value = data || [];

    await nextTick();
    restoreScrollPosition();
  } catch (error) {
    console.error("데이터를 불러오는 동안 에러가 발생하였습니다.");
  } finally {
    isLoading.value = false;
  }
};

watchEffect(() => {
  searchStore.setPosts(freeboardList.value);
});
const searchResults = computed(() => searchStore.filteredPosts);

onMounted(async () => {
  await fetchFreeboard();
  window.addEventListener("scroll", saveScrollPosition);
});

onBeforeRouteLeave((to, _, next) => {
  if (to.path.includes("/freeboard/")) {
    saveScrollPosition();
  }
  next();
});

onUnmounted(() => {
  if (!route.path.includes("/freeboard/")) {
    saveScrollPosition();
  }
  window.removeEventListener("scroll", saveScrollPosition);
});

// route.params.team이 변경될 때마다 반응
watch(
  () => route.params.team,
  (newTeamName, _) => {
    // 업데이트
    clubId.value = teamID[newTeamName];
    fetchFreeboard();
  }
);
</script>
<template>
  <Loading v-if="isLoading" />
  <div class="flex flex-col px-[50px] py-[30px]">
    <div class="w-[990px] gap-[50px] flex flex-col mx-auto">
      <!-- 글쓰기 버튼 -->
      <GoToCreate :text="'자유 게시판에 글 쓰러 가기'" />
      <!-- 목록 -->
      <div
        class="flex flex-col w-full h-full gap-[20px] items-center"
        v-if="freeboardList"
      >
        <template v-if="searchResults.length > 0">
          <FreeBoardPost
            v-for="(post, index) in searchResults"
            :key="index"
            :post="post"
          />
        </template>
        <template v-else>
          <span>게시물이 없습니다. 게시물을 작성해보세요!</span>
        </template>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
