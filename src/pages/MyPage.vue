<script setup>
import {
  getCommentedPostsByMemberId,
  getLikedPostsByMemberId,
  getPostsByMemberId,
} from "@/api/supabase-api/getPostsByMyId";
import Loading from "@/components/common/Loading.vue";
import ActiveTabs from "@/components/mypage/ActiveTabs.vue";
import MyPostCard from "@/components/mypage/MyPostCard.vue";
import ProfileViewAndEdit from "@/components/mypage/ProfileViewAndEdit.vue";
import { useAuthStore } from "@/stores/auth";
import { computed, onMounted, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

const isLoading = ref(true);

const router = useRouter();
const authStore = useAuthStore();

const currentUserData = computed(() => authStore.user || {});
const isLoggedIn = computed(() => authStore.isAuthenticated());

const activeTab = ref("posts");
const displayedData = computed(() => {
  switch (activeTab.value) {
    case "posts":
      return createdPosts.value;
    case "comments":
      return commentedPosts.value;
    case "likes":
      return likedPosts.value;
    default:
      return [];
  }
});

const createdPosts = ref([]);
const commentedPosts = ref([]);
const likedPosts = ref([]);
const fetchUserData = async () => {
  if (!isLoggedIn.value) return;

  try {
    const userId = currentUserData.value.id;
    const [posts, comments, likes] = await Promise.all([
      getPostsByMemberId(userId),
      getCommentedPostsByMemberId(userId),
      getLikedPostsByMemberId(userId),
    ]);

    createdPosts.value = posts;
    commentedPosts.value = comments;
    likedPosts.value = likes;
  } catch (error) {
    console.error("유저 데이터 불러오기 중 오류 발생", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await authStore.fetchCurrentUser();
  if (!isLoggedIn.value) {
    router.push("/signin");
  } else {
    fetchUserData();
  }
});

watchEffect(() => {
  if (isLoggedIn.value) {
    fetchUserData();
  }
});
</script>
<template>
  <Loading v-if="isLoading" />
  <div class="gap-[148px] mt-[152px] overflow-x-hidden">
    <div class="px-[147px] flex flex-col items-center">
      <div class="flex w-[990px]">
        <ProfileViewAndEdit />
        <ActiveTabs
          v-model:activeTab="activeTab"
          :createdPostsCount="createdPosts.length"
          :commentedPostsCount="commentedPosts.length"
          :likedPostsCount="likedPosts.length"
        />
      </div>
      <div class="w-full max-w-[990px] mt-[40px]">
        <div
          v-if="displayedData.length > 0"
          class="py-[10px] mb-[100.33px] border-t border-gray01 grid grid-cols-3 gap-[10px]"
        >
          <MyPostCard :displayedData="displayedData" />
        </div>
        <div
          v-else
          class="border-t border-gray01 flex flex-col items-center pt-[100px] gap-[20px]"
        >
          <h2 class="text-black01 text-center">
            😊 하단 네비게이션 바를 통해 포스팅을 시작하세요 😊
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>
