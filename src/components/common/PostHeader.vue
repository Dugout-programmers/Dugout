<script setup>
import { getCurrentUser } from "@/api/supabase-api/userInfo";
import RecruitmentStatus from "@/components/crewboard/RecruitmentStatus.vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Modal from "@/components/common/Modal.vue";
import BaseballLogo from "@/assets/icons/default_profile_xl.svg";
import { computed, ref, watchEffect } from "vue";

//profileImage, memberId, postId는 post로 한번에 전달
//title은 게시판마다 포맷이 달라 상위 컴포넌트에서 변형해 전달
//time도 상위 컴포넌트에서 포맷 변화해 사용하고 있어 상위 컴포넌트에서 변화한 포맷으로 전달
const props = defineProps({
  crewBoard: {
    type: Boolean,
    required: false,
    default: false,
  },
  status: {
    type: String,
    // required: true,
  },
  title: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  post: {
    type: Object,
    required: true,
  },
  confirmDelete: {
    type: Function,
    required: true,
  },
});
// const currentUserId = ref(null); // 피니아로 데이터 가져오기
const authStore = useAuthStore(); // 유저 정보가 가져오기

const route = useRoute();
const router = useRouter();
const reactiveTitle = ref(props.title);

// 현재 로그인한 유저의 ID 가져오기 -> 피니아로 대체
// onMounted(async () => {
//   const user = await getCurrentUser();
//   if (user) {
//     currentUserId.value = user.id;
//   }
// });

// 본인 게시물인지 여부 확인 (본인 게시물 아니면 수정, 삭제 버튼 보이지 않게 처리)
const isOwner = computed(() => {
  return authStore.user?.id === props.post.member_id;
});

watchEffect(() => {
  reactiveTitle.value = props.title;
});

//현재 게시판 종류 가져오기
const boardType = computed(() => {
  const boardPath = route.path.split("/");
  return boardPath[2] || "";
});

// 수정 페이지 경로 동적으로 생성
const editPageUrl = computed(() => {
  return `/${route.params.team}/${boardType.value}/${props.post.post_id}/edit`;
});

const goToEditPage = () => {
  router.push(editPageUrl.value);
};
</script>
<template>
  <!-- 모달 -->
  <Modal />
  <!-- 상세 페이지 정보 -->
  <div class="flex flex-col gap-[10px] pb-5 border-b border-white02">
    <!-- 제목 -->
    <div class="flex items-center gap-[15px]">
      <span class="text-2xl font-bold">{{ reactiveTitle }}</span>
      <!-- crew모집 페이지에서만 다음 컴포넌트 출력 -->
      <RecruitmentStatus v-if="props.crewBoard" :status="props.status" />
    </div>
    <!-- 유저 정보 / 수정 삭제 -->
    <div class="flex items-center justify-between">
      <!-- 유저정보 -->
      <div class="flex items-center gap-[10px]">
        <img
          :src="post.author_image || BaseballLogo"
          alt="유저 프로필"
          class="w-[25px] h-[25px] rounded-full"
          :class="{
            'outline outline-1 outline-gray02': !post.author_image,
          }"
        />
        <span class="text-xs text-gray03">{{ props.post.author_name }}</span>
        <span class="text-xs text-gray02">{{ props.time }}</span>
      </div>
      <!-- 수정 삭제 버튼 -->
      <div
        v-if="authStore.user && isOwner"
        class="flex text-xs text-gray02 gap-[4px]"
      >
        <button @click="goToEditPage" class="hover:text-gray03">수정</button>
        <span>|</span>
        <button @click="confirmDelete" class="hover:text-gray03">삭제</button>
      </div>
    </div>
  </div>
</template>

<style coped></style>
