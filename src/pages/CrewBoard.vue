<script setup>
import { getCrewRecruitmentPostsByClub } from "@/api/supabase-api/crewRecruitmentPost";
import GoToCreate from "@/components/common/GoToCreate.vue";
import Loading from "@/components/common/Loading.vue";
import CrewCard from "@/components/crewboard/CrewCard.vue";
import { teamID } from "@/constants";
import { useSearchStore } from "@/stores/searchStore";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const searchStore = useSearchStore();
const teamName = ref(route.params.team);
const clubId = ref(teamID[teamName.value]);
const posts = ref([]);
const currentUser = ref(null);
const isLoading = ref(true);

const saveScrollPosition = () => {
  sessionStorage.setItem("crewboard-scroll", window.scrollY.toString());
};

const restoreScrollPosition = () => {
  const savedScroll = sessionStorage.getItem("crewboard-scroll");
  if (savedScroll) {
    window.scrollTo(0, parseInt(savedScroll, 10) || 0);
  }
};

// 특정 게시물 데이터 가져오기
const fetchPosts = async () => {
  const data = await getCrewRecruitmentPostsByClub(clubId.value);
  if (data) {
    posts.value = data || [];

    setTimeout(() => {
      restoreScrollPosition();
    }, 0);
  } else {
    console.log("직관 크루 모집 게시물이 없습니다.");
  }
  isLoading.value = false;
};

// 🔥 searchResults를 computed로 정의 (검색 필터 적용)
const searchResults = computed(() => {
  if (searchStore.query) {
    return posts.value.filter(
      (post) =>
        post.title.includes(searchStore.query) ||
        post.content.includes(searchStore.query)
    );
  }
  return posts.value;
});

// 현재 로그인 사용자 정보 불러오기
// const getUserInfo = async () => {
//   const userData = await getCurrentUser();
//   if (userData) {
//     currentUser.value = userData; // 로그인된 사용자 정보 저장
//   } else {
//     currentUser.value = null; // 비로그인 상태
//   }
// };

// const handleButtonClick = () => {
//   if (currentUser.value) {
//     router.push(`/${teamName.value}/crewboard/create`);
//   } else {
//     // 비로그인 상태: 알림 및 로그인 페이지로 이동
//     alert("로그인 후 이용 가능합니다.");
//     router.push("/signin"); // 로그인 페이지 경로
//   }
// };

onMounted(async () => {
  await fetchPosts();
  // await getUserInfo();
  window.addEventListener("scroll", saveScrollPosition);
});

onBeforeRouteLeave((to, _, next) => {
  if (to.path.includes("/crewboard")) {
    saveScrollPosition();
  }
  next();
});

onUnmounted(() => {
  if (!route.path.includes("/crewboard")) {
    saveScrollPosition();
  }
  window.removeEventListener("scroll", saveScrollPosition);
});

watch(
  () => route.params.team,
  async (newTeamName, _) => {
    clubId.value = teamID[newTeamName];
    await fetchPosts();
  }
);
</script>

<template>
  <Loading v-if="isLoading" />
  <div class="flex flex-col px-[50px] py-[30px]">
    <div class="flex flex-col gap-[50px] w-[990px] mx-auto">
      <div class="cursor-pointer">
        <GoToCreate :text="'직관 크루 모집에 글 쓰러 가기'" />
      </div>
      <div class="grid grid-cols-3 gap-[30px]">
        <template v-if="searchResults.length">
          <CrewCard
            v-for="post in searchResults"
            :key="post.post_id"
            :post="post"
            class="cursor-pointer"
          />
        </template>
        <template v-else>
          <div class="flex items-center justify-center w-full col-span-3">
            <span class="text-center">
              게시물이 없습니다. 게시물을 작성해보세요!
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
