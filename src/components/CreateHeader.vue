<script setup>
import { useModalStore } from "@/stores/useModalStore";
import { useRoute, useRouter } from "vue-router";
import Modal from "./common/Modal.vue";
import { computed } from "vue";
import { teamList } from "@/constants";

// props로 등록 눌렀을 때 실행될 함수와 취소 버튼 눌렀을 때 실행할 함수 전달하면 됩니다.
const props = defineProps({
  handleRegister: {
    type: Function,
  },
  handleCancel: {
    type: Function,
  },
});
const modalStore = useModalStore();
const route = useRoute();
const router = useRouter();

const teamName = computed(() => route.params.team); // 팀이름
const boardName = computed(() => route.path.split("/")[2]); // 게시판 이름
const postID = computed(() => route.path.split("/")[3]); // 포스트 ID
const isEditPage = computed(() => route.path.split("/").pop() === "edit"); // 편집 페이지인지 유무 판단

// css적용을 위해 url을 통해서 팀 닉네임 찾기
const nickname = computed(() => {
  const team = teamList.find((team) => team.name === route.params.team);
  return team?.nickname;
});

// 취소 버튼 눌렀을 때 취소 모달창 띄우기
const openCancelModal = () => {
  modalStore.openModal({
    message: "작성했던 모든 내용은 저장되지 않습니다.\n취소하시겠습니까?",
    type: "twoBtn",
    onConfirm: () => {
      handleCancel();
      modalStore.closeModal();
    },
    onCancel: modalStore.closeModal,
  });
};

// 취소 함수 핸들링 (props.handleCancel이 없는 경우 기존 취소함수 실행)
const handleCancel =
  props.handleCancel ||
  (() => {
    // 편집 페이지인 경우
    if (isEditPage.value) {
      router.push(`/${teamName.value}/${boardName.value}/${postID.value}`);
    }
    // 등록페이지인 경우
    else {
      router.push(`/${teamName.value}/${boardName.value}`);
    }
  });

const openRegisterEditModal = () => {
  // 편집 페이지 유무에 따라서 메세지 달리하기

  const message = isEditPage.value
    ? "수정을 완료하시겠습니까?"
    : "등록을 완료하시겠습니까?";
  modalStore.openModal({
    message,
    type: "twoBtn",
    onConfirm: () => {
      props.handleRegister();
      modalStore.closeModal();
    },
    onCancel: modalStore.closeModal,
  });
};
</script>
<template>
  <Modal />
  <div class="border-b border-b-white02 flex justify-end py-[15.5px] px-[30px]">
    <div class="flex gap-5">
      <button
        class="w-[68px] h-[39px] rounded-[8px] text-black01 text-bold text-4 cursor-pointer"
        :class="nickname ? `bg-${nickname}_opa10` : 'bg-gray01'"
        @click="openCancelModal"
      >
        취소
      </button>
      <button
        class="w-[68px] h-[39px] rounded-[8px] text-black01 text-bold text-4 cursor-pointer"
        :class="nickname ? `bg-${nickname}_opa30` : 'bg-gray01'"
        @click="openRegisterEditModal"
      >
        {{ isEditPage ? "수정" : "등록" }}
      </button>
    </div>
  </div>
</template>
<style scoped></style>
