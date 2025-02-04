<script setup>
import {
  deleteFreePost,
  getFreePostDetailsById,
} from "@/api/supabase-api/freePost";
import backIcon from "@/assets/icons/back.svg";
import CommentSection from "@/components/common/CommentSection.vue";
import PostHeader from "@/components/common/PostHeader.vue";
import { useModalStore } from "@/stores/useModalStore";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
// day.js
import Loading from "@/components/common/Loading.vue";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 가져오기
import relativeTime from "dayjs/plugin/relativeTime";

const props = defineProps({
  id: String, // post_id
  team: String,
});

const isLoading = ref(false);

const post = ref(null); // 게시물 상세 정보를 담을 변수
const router = useRouter();
const modalStore = useModalStore(); // 모달 관리
// day.js
dayjs.extend(relativeTime); // relativeTime 플러그인 활성화
dayjs.locale("ko"); // 한국어 로케일 설정

// 게시물 상세 정보를 가져오는 함수
const fetchFreeboardDetail = async () => {
  try {
    isLoading.value = true;
    const data = await getFreePostDetailsById(props.id);
    post.value = data;
  } catch (error) {
    console.error("데이터를 불러오는 도중에 오류가 발생했습니다.");
  } finally {
    isLoading.value = false;
  }
};

// 게시물 삭제하는 함수
const fetchmDeletePost = () => {
  modalStore.openModal({
    message: "삭제 후에는 복구할 수 없습니다 \n삭제하시겠습니까?",
    type: "twoBtn",
    onConfirm: async () => {
      isLoading.value = true;
      await deleteFreePost(props.id);
      modalStore.closeModal();
      router.push(`/${props.team}/freeboard`);
      isLoading.value = false;
    },
    onCancel: modalStore.closeModal(),
  });
};

onMounted(() => {
  fetchFreeboardDetail();
});
</script>
<template>
  <Loading v-if="isLoading" />
  <div class="px-[50px] py-[30px] flex flex-col">
    <!-- 뒤로가기 -->
    <div class="mb-[50px] flex w-full">
      <button @click="router.go(-1)">
        <img :src="backIcon" alt="뒤로가기 아이콘" />
      </button>
    </div>
    <!-- 상세페이지 -->
    <div class="flex flex-col gap-[50px] w-[990px] mx-auto" v-if="post">
      <!-- 상세 페이지 정보 -->
      <PostHeader
        :title="post.title"
        :time="dayjs(post.created_at).fromNow()"
        :post="post"
        :confirm-delete="fetchmDeletePost"
      />
      <!-- 게시물 내용 -->
      <div class="border-b border-gray01 pb-[50px]">
        <div v-html="post.content" class="prose ql-editor max-w-none"></div>
      </div>

      <!-- 코멘트 부분 -->
      <CommentSection
        :likeLength="post.like_count"
        :commentLength="post.comment_count"
      />
    </div>
  </div>
</template>

<style scoped></style>
