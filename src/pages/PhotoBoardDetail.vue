<script setup>
import {
  deleteCertificationPost,
  getCertificationPostDetailsById,
} from "@/api/supabase-api/viewingCertificationPost";
import backIcon from "@/assets/icons/back.svg";
import CommentSection from "@/components/common/CommentSection.vue";
import PostHeader from "@/components/common/PostHeader.vue";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import Loading from "@/components/common/Loading.vue";
import Modal from "@/components/common/Modal.vue";
import { useModalStore } from "@/stores/useModalStore";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 가져오기
import relativeTime from "dayjs/plugin/relativeTime";

const isLoading = ref(false);

const router = useRouter();

const route = useRoute();
const postId = ref(route.params.id);

const post = ref({});
const modalStore = useModalStore();
const title = ref("");

// day.js
dayjs.extend(relativeTime); // relativeTime 플러그인 활성화
dayjs.locale("ko"); // 한국어 로케일 설정

const fetchPhotoboardDetail = async (postId) => {
  if (!postId) {
    console.warn("postId가 존재하지 않음.");
    return;
  }

  try {
    isLoading.value = true;
    const data = await getCertificationPostDetailsById(postId);

    if (data) {
      post.value = data;
    } else {
      console.warn("데이터가 존재하지 않음");
      post.value = {};
    }
  } catch (error) {
    console.error("데이터를 가져오지 못함", error);
  } finally {
    isLoading.value = false;
  }
};

const formattedContent = computed(() => {
  return post.value.content ? post.value.content.replace(/\n/g, "<br>") : "";
});

const titleGameDate = (gameDate) => {
  if (!gameDate || typeof gameDate !== "string") return "";
  if (gameDate.split("-").length < 3) return "";
  const year = gameDate.split("-")[0].slice(2);
  const month = gameDate.split("-")[1];
  const day = gameDate.split("-")[2];

  return `[${year}${month}${day}]`;
};

watchEffect(() => {
  if (post.value && post.value.game_date) {
    const postGameDate = titleGameDate(post.value.game_date);
    title.value = `${postGameDate} ${post.value.title || ""}`;
  }
});

onMounted(() => {
  if (!postId.value) {
    console.warn("route.params.id가 존재하지 않음.");
    return;
  }
  fetchPhotoboardDetail(postId.value);
});

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      postId.value = newId;
      fetchPhotoboardDetail(newId);
    }
  }
);

const confirmDelete = () => {
  modalStore.openModal({
    message: "삭제 후에는 복구할 수 없습니다 \n삭제하시겠습니까?",
    type: "twoBtn",
    onConfirm: async () => {
      isLoading.value = true;
      await deleteCertificationPost(postId.value);
      modalStore.closeModal();
      router.push(`/${route.params.team}/photoboard`); // ✅ 삭제 후 이동
      isLoading.value = false;
    },
    onCancel: modalStore.closeModal(),
  });
};
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
    <div class="flex flex-col gap-[50px] w-[990px] mx-auto">
      <!-- 상세 페이지 정보 -->
      <PostHeader
        :title="title"
        :post="post"
        :time="dayjs(post.created_at).fromNow()"
        :confirm-delete="confirmDelete"
      />
      <Modal />
      <!-- 게시물 내용 -->
      <div class="pt-[50px] pb-[50px] gap-[30px] flex border-b border-b-gray01">
        <div
          class="aspect-square w-[450px] h-[450px] rounded-[10px] overflow-hidden"
        >
          <img :src="post.image" alt="" class="object-cover w-full h-full" />
        </div>
        <div class="flex-1">
          <p
            class="w-full h-full py-5 text-[18px] text-black01"
            v-html="formattedContent"
          ></p>
        </div>
      </div>

      <!-- 코멘트 부분 -->
      <CommentSection />
    </div>
  </div>
</template>

<style scoped></style>
