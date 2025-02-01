<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import {
  getCommentedPostsByMemberId,
  getLikedPostsByMemberId,
  getPostsByMemberId,
} from "@/api/supabase-api/getPostsByMyId";
import { useRouter } from "vue-router";
import MyPostCard from "@/components/mypage/MyPostCard.vue";
import ActiveTabs from "@/components/mypage/ActiveTabs.vue";
import ProfileViewAndEdit from "@/components/mypage/ProfileViewAndEdit.test.vue";

const router = useRouter()
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

    console.log("유저 데이터 불러오기 완료", { posts, comments, likes });

    createdPosts.value = posts;
    commentedPosts.value = comments;
    likedPosts.value = likes;
  } catch (error) {
    console.error("유저 데이터 불러오기 중 오류 발생", error);
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

</script>
<template>
  <div class="gap-[148px] mt-[152px]">
    <div class="px-[147px] flex flex-col items-center">
      <div class="flex w-[990px]">
        <ProfileViewAndEdit/>
        <ActiveTabs  v-model:activeTab="activeTab" :createdPostsCount="createdPosts.length" :commentedPostsCount="commentedPosts.length" :likedPostsCount="likedPosts.length"/>
      </div>
      <div class="w-full max-w-[990px] mt-[40px]">
        <div
          v-if="displayedData"
          className="py-[10px] mb-[100.33px] border-t border-gray01  grid grid-cols-3 gap-[10px]"
        >
         <MyPostCard :displayedData="displayedData"/>
        </div>
      </div>
    </div>
  </div>
</template>