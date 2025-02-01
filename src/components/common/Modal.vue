<script setup>
import { useModalStore } from "@/stores/useModalStore";

const modalStore = useModalStore();

// 취소 함수
const handleCancel = () => {
  // onCancel 함수를 props로 받았으면 함수 실행 아니면 모달 창 닫기
  if (modalStore.modalProps.onCancel) {
    modalStore.modalProps.onCancel();
  } else {
    modalStore.closeModal();
  }
};

// 확인 핸들러
const handleConfirm = () => {
  if (modalStore.modalProps.onConfirm) {
    modalStore.modalProps.onConfirm();
  } else {
    modalStore.closeModal();
  }
};
</script>
<template>
  <!-- 모달 -->
  <div
    v-if="modalStore.isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div
      class="w-96 h-60 py-12 bg-neutral-50 rounded-lg border border-zinc-100 flex-col justify-center items-center gap-2.5 flex"
    >
      <div class="flex flex-col items-center justify-center h-36 gap-7">
        <div
          class="text-xl font-semibold text-center text-black whitespace-pre-line"
        >
          {{ modalStore.modalProps.message }}
        </div>
        <!-- 버튼 1개짜리일 때  -->
        <!-- <div class="justify-start items-center gap-2.5 inline-flex">
          <div
            @click="
              modalStore.modalProps.onConfirm
                ? modalStore.modalProps.onConfirm()
                : modalStore.closeModal()
            "
            class="w-24 h-12 px-8 py-3.5 bg-zinc-400 rounded-lg justify-center items-center gap-2.5 flex cursor-pointer">
            <div class="text-black text-lg font-normal font-['Pretendard']">
              확인
            </div>
          </div>
        </div> -->
        <!-- 버튼 2개짜리일 때  -->
        <div class="items-center gap-2.5 flex">
          <!-- 취소 버튼 -->
          <button
            v-if="modalStore.modalProps.type !== 'oneBtn'"
            @click="handleCancel"
            class="text-lg text-black w-24 h-12 px-8 py-3.5 bg-zinc-100 rounded-lg justify-center items-center gap-2.5 flex cursor-pointer"
          >
            취소
          </button>
          <!-- 확인 버튼 -->
          <button
            @click="handleConfirm"
            class="text-lg text-black w-24 h-12 px-3.5 py-3.5 bg-zinc-400 rounded-lg justify-center items-center gap-2.5 flex cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* .message {
  white-space: pre-line;
} */
</style>
