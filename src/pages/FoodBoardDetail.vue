<script setup>
import { deleteRestaurantPost, getRestaurantPostDetailsById } from "@/api/supabase-api/restaurantPost";
import backIcon from "@/assets/icons/back.svg";
import CommentSection from "@/components/CommentSection.vue";
import PostHeader from "@/components/PostHeader.vue";
import LocationViewer from "@/components/foodboard/LocationViewer.vue";
import { useModalStore } from "@/stores/useModalStore";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
dayjs.extend(relativeTime);
dayjs.locale("ko");

const router = useRouter();
const route = useRoute();
const modalStore = useModalStore()
const postDetails = ref(null);
const postImages = ref([]);
const postId = ref(route.params.id);

const fetchFoodPostDetail = async () => {
  try {
    const data = await getRestaurantPostDetailsById(postId.value);
    console.log(data);
    postDetails.value = {
      ...data,
      images: data.images?.map((img) => img.url),
    };
    postImages.value = postDetails.value.images;
  } catch (error) {
    console.error("데이터를 불러오는 중 오류 발생:", error);
  }
};

const calculatedCreatedAt = computed(() => {
  if (!postDetails.value?.created_at) return "";
  return dayjs(postDetails.value.created_at).fromNow();
});

onMounted(() => {
  fetchFoodPostDetail();

});

const handleDeletePost = async () => {
  try {
    await deleteRestaurantPost(postId.value)
  } catch(error) {
    console.error("삭제하던 중 오류가 발생했습니다", error)
  }
}

const onClickDelete = () => {
modalStore.openModal({
    message: "삭제한 후에는 복구할 수 없습니다\n삭제하시겠습니까?",
    type: "twoBtn",
    onConfirm: () => {
      handleDeletePost()
      modalStore.closeModal();
      router.go(-1)
    }, 
    onCancel: modalStore.closeModal,
  });
}

</script>
<template>
  <div class="px-[50px] py-[30px] items-center flex flex-col">
    <!-- 뒤로가기 버튼 -->
    <div class="mb-[50px] flex w-full">
      <button @click="router.go(-1)">
        <img :src="backIcon" alt="뒤로가기 아이콘" />
      </button>
    </div>

    <!-- 게시물 상세 페이지 -->
    <div class="flex flex-col gap-[50px] w-[990px]">
      <!-- 헤더 정보 -->
      <PostHeader
        v-if="postDetails"
        :title="postDetails.title"
        :post="postDetails"
        :time="calculatedCreatedAt"
        :confirmDelete="onClickDelete"
      />

      <!-- 게시물 내용 -->
      <div
        v-if="postDetails"
        class="mt-[50px] gap-[50px] pb-[50px] flex flex-col border-b border-b-gray01"
      >
        <div class="flex flex-col gap-[30px]">
          <LocationViewer v-if="postDetails.location" :postLocation="postDetails.location" />
          <div>
            <div
              v-html="postDetails.content"
              class="prose ql-editor max-w-none"
            ></div>
          </div>

          <!-- 이미지 목록 -->
          <div
            v-if="postImages"
            class="flex h-[310px] gap-[30px] justify-center"
          >
            <div
              v-for="(imageUrl, index) in postImages"
              :key="index"
              class="aspect-square rounded-[10px] overflow-hidden"
            >
              <img :src="imageUrl" class="object-cover w-full h-full" />
            </div>
          </div>
        </div>

        <!-- 태그 목록 -->
        <div class="flex gap-[10px]">
          <span
            v-for="(tag, index) in postDetails.tags"
            :key="index"
            class="text-[18px] text-gray03"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- 댓글 섹션 -->
      <CommentSection v-if="postDetails" />
    </div>
  </div>
</template>
