<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import PostArrow from "@/assets/icons/post_arrow.svg";
import { teamList } from "@/constants";
import { useAuthStore } from "@/stores/auth";
import { useModalStore } from "@/stores/useModalStore";
import Modal from "@/components/common/Modal.vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore(); // 유저 정보가 가져오기
const modalStore = useModalStore();

const teamName = computed(() => route.params.team); // 팀이름
const boardName = computed(() => route.path.split("/")[2]); // 게시판 이름
// css적용을 위해 url을 통해서 팀 닉네임 찾기
const nickname = computed(() => {
  const team = teamList.find((team) => team.name === route.params.team);
  return team?.nickname;
});

// 로그인 유무에 따라서 라우팅
const checkAuthAndRoute = () => {
  // 비로그인이면
  if (!authStore.user) {
    modalStore.openModal({
      message: "로그인 후 이용 가능한 서비스입니다.\n로그인 하시겠습니까?",
      type: "twoBtn",
      onConfirm: () => {
        router.push("/signin");

        modalStore.closeModal();
      },
      onCancel: modalStore.closeModal,
    });
    return;
  }
  router.push(`/${teamName.value}/${boardName.value}/create`);
};
</script>
<template>
  <Modal />
  <button
    class="flex items-center justify-center w-full font-medium py-[10px] rounded-[10px] gap-[10px] cursor-pointer"
    :class="`bg-${nickname}_opa30`"
    @click="checkAuthAndRoute"
  >
    {{ props.text }}
    <img :src="PostArrow" class="w-[14px] h-[8px]" />
  </button>
</template>
<style scoped></style>
