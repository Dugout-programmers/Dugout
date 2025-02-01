<script setup>
import {
  getUserInfoById,
  getViewingCertificationPostsByClub,
} from "@/api/supabase-api/viewingCertificationPost";
import PhotoboardCard from "@/components/photoboard/PhotoboardCard.vue";
import { teamID } from "@/constants";
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  watchEffect,
} from "vue";
import { useRoute } from "vue-router";
import GoToCreate from "@/components/common/GoToCreate.vue";
import { useSearchStore } from "@/stores/searchStore";

const searchStore = useSearchStore();

const route = useRoute();
const teamName = ref(route.params.team);
const clubId = ref(teamID[teamName.value]);

const photoboardList = ref([]);

const saveScrollPosition = () => {
  sessionStorage.setItem("photoboard-scroll", window.scrollY.toString());
};

const restoreScrollPosition = () => {
  const savedScroll = sessionStorage.getItem("photoboard-scroll");
  if (savedScroll) {
    window.scrollTo(0, parseInt(savedScroll, 10) || 0);
  }
};

const updateUserInfoForPosts = async () => {
  if (!photoboardList.value.length) return;

  const updatedPosts = await Promise.all(
    photoboardList.value.map(async (post) => {
      if (!post.member_id) return post;

      const userInfo = await getUserInfoById(post.member_id);
      if (userInfo) {
        return {
          ...post,
          author_image: userInfo.image,
          name: userInfo.name,
        };
      }
      return post;
    })
  );
  photoboardList.value = updatedPosts;
};

const fetchPhotoboardList = async () => {
  try {
    const data = await getViewingCertificationPostsByClub(clubId.value);
    photoboardList.value = data || [];

    await updateUserInfoForPosts();

    setTimeout(() => {
      restoreScrollPosition();
    }, 0);
  } catch (error) {
    console.error("직관인증포토 포스트를 불러오지 못했습니다");
  }
};

// watchEffect(() => {
//   updateUserInfoForPosts();
// });

onMounted(() => {
  fetchPhotoboardList();
  window.addEventListener("scroll", saveScrollPosition);
});

onUnmounted(() => {
  saveScrollPosition();
  window.removeEventListener("scroll", saveScrollPosition);
});

watch(
  () => route.params.team,
  async (newTeamName) => {
    teamName.value = newTeamName;
    clubId.value = teamID[newTeamName];

    await nextTick();
    fetchPhotoboardList();
  },
  { immediate: true }
);

watchEffect(() => {
  searchStore.setPosts(photoboardList.value);
});

const searchResults = computed(() => searchStore.filteredPosts);
</script>
<template>
  <div class="flex gap-[30px] flex-col px-[50px] py-[30px] items-center">
    <div class="w-[990px] gap-[50px] flex flex-col">
      <!-- 글쓰기 버튼 -->
      <GoToCreate :text="'직관 인증 포토 올리러 가기'" />
      <!-- 목록 -->
      <div class="w-full h-auto mb-[100px]">
        <div
          v-if="searchResults.length > 0"
          class="grid grid-cols-3 gap-[30px] w-full"
        >
          <PhotoboardCard
            v-for="post in searchResults"
            :key="post.id"
            :post="post"
          />
        </div>
        <div v-else class="flex justify-center items-center w-full col-span-3">
          <span class="text-center"
            >게시물이 없습니다. 게시물을 작성해보세요!</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
