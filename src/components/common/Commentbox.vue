<script setup>
import { deleteComment, updateComment } from "@/api/supabase-api/commonComment";
import BaseballLogo from "@/assets/icons/default_profile_xl.svg";
import Modal from "@/components/common/Modal.vue";
import { boardToTableMapping } from "@/constants";
import { useModalStore } from "@/stores/useModalStore";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import { nextTick, ref } from "vue";
import { useRoute } from "vue-router";
dayjs.extend(relativeTime);
dayjs.locale("ko");

const isVisable = ref(false);

const props = defineProps({
  comment: {
    type: Object,
  },
  comments: {
    type: Array,
  },
  currentUserId: {
    type: String,
  },
});
const emit = defineEmits(["refresh-comments"]);

const route = useRoute();
const boardName = route.path.split("/")[2];
const isEditing = ref(false);
const inputRef = ref(null);
const commentText = ref(props.comment.content);
const modalStore = useModalStore();

const fetchDeleteComment = async () => {
  console.log("현재 댓글 목록:", props.comments);
  const deletedCommentId = props.comment.id;
  const newComments = props.comments.filter(
    (comment) => comment.id !== deletedCommentId
  );
  emit("refresh-comments", newComments);

  try {
    await deleteComment(boardToTableMapping[boardName], deletedCommentId);
  } catch (error) {
    console.error("댓글을 삭제하는 중 오류 발생:", error.message);
    const originalComments = [...props.comments];
    emit("refresh-comments", originalComments);
  }
};

const handleEdit = () => {
  isEditing.value = true;
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus();
    }
  });
};

const handleCancel = () => {
  isEditing.value = false;
  commentText.value = props.comment.content;
};

const fetchUpdateComment = async () => {
  const originalText = props.comment.content;
  const updatedComment = { ...props.comment, content: commentText.value };
  const updatedComments = props.comments.map((comment) =>
    comment.id === props.comment.id ? updatedComment : comment
  );
  emit("refresh-comments", updatedComments);
  isEditing.value = false;
  try {
    const data = await updateComment(
      boardToTableMapping[boardName],
      props.comment.id,
      commentText.value
    );
    const newComments = props.comments.map((comment) =>
      comment.id === props.comment.id ? { ...comment, ...data } : comment
    );
    emit("refresh-comments", newComments);
  } catch (error) {
    console.error("댓글을 수정하는 중 오류 발생:", error.message);
    const newComments = props.comments.map((comment) =>
      comment.id === props.comment.id
        ? { ...comment, content: originalText }
        : comment
    );
    emit("refresh-comments", newComments);
  }
};

const onClickDeleteComment = () => {
  modalStore.isVisible = true;
  modalStore.modalProps.message =
    "삭제 후에는 복구할 수 없습니다 \n삭제하시겠습니까?";
  modalStore.modalProps.onConfirm = async () => {
    await fetchDeleteComment();
    modalStore.closeModal();
  };
  modalStore.modalProps.onCancel = modalStore.closeModal;
};
</script>

<template>
  <Modal v-if="isVisable" />
  <div class="pb-5 border-b border-white02">
    <div class="flex items-center justify-between">
      <div class="flex gap-[10px] items-center">
        <img
          :src="props.comment.user_info.image || BaseballLogo"
          alt="유저 프로필"
          class="w-[35px] h-[35px] rounded-full"
          :class="{
            'outline outline-1 outline-gray02': !props.comment.user_info.image,
          }"
        />
        <span class="text-sm font-bold text-gray03">{{
          props.comment.user_info.name
        }}</span>
        <span class="text-xs text-gray02">{{
          dayjs(props.comment.created_at).fromNow()
        }}</span>
      </div>

      <div v-if="props.comment.member_id === props.currentUserId">
        <div class="flex text-xs text-gray02 gap-[4px]" v-if="!isEditing">
          <button class="hover:text-gray03" @click="handleEdit">수정</button>
          <span>|</span>
          <button class="hover:text-gray03" @click="onClickDeleteComment">
            삭제
          </button>
        </div>

        <div class="flex text-xs text-gray02 gap-[4px]" v-else>
          <button class="hover:text-gray03" @click="handleCancel">취소</button>
          <span>|</span>
          <button class="hover:text-gray03" @click="fetchUpdateComment">
            저장
          </button>
        </div>
      </div>
    </div>

    <div class="px-[45px]">
      <span v-if="!isEditing" class="text-[#515151]">{{
        props.comment.content
      }}</span>
      <input
        v-else
        v-model="commentText"
        type="text"
        class="p-2 px-4 bg-white01 rounded-[8px] border border-gray01 outline-none w-full"
        placeholder="댓글을 입력해주세요"
        ref="inputRef"
      />
    </div>
  </div>
</template>
