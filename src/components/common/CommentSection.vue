<script setup>
import { createComment, getComments } from "@/api/supabase-api/commonComment";
import {
  addLike,
  getLikes,
  removeLike,
} from "@/api/supabase-api/commonLikeWithoutDuplication";
import { getCurrentUser } from "@/api/supabase-api/userInfo";
import commentIcon from "@/assets/icons/comment.svg";
import commentBtnIcon from "@/assets/icons/comment_btn.svg";
import likeIcon from "@/assets/icons/like.svg";
import likeIconFilled from "@/assets/icons/like_fill.svg";
import { boardToTableMapping } from "@/constants";
import { useAuthStore } from "@/stores/auth";
import { useModalStore } from "@/stores/useModalStore";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Commentbox from "./Commentbox.vue";

const route = useRoute();
const router = useRouter();
const postId = ref(route.params.id);
const boardName = route.path.split("/")[2];
const commentText = ref("");
const comments = ref([]);
const likes = ref([]);
const currentUserId = ref(null);
const currentUserName = ref(null);
const currentUserImage = ref(null);
const isSubmitting = ref(false);
const authStore = useAuthStore();
const modalStore = useModalStore();

const liked = computed(() =>
  likes.value.some((like) => like.member_id === currentUserId.value)
);
const sortedComments = computed(() =>
  [...comments.value].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )
);

const fetchLikes = async () => {
  try {
    likes.value = await getLikes(boardToTableMapping[boardName], postId.value);
  } catch (error) {
    console.error("좋아요 정보를 가져오는 중 오류 발생:", error.message);
  }
};

const toggleLike = async () => {
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

  try {
    if (liked.value) {
      likes.value = likes.value.filter(
        (like) => like.member_id !== currentUserId.value
      );
      await removeLike(
        boardToTableMapping[boardName],
        postId.value,
        currentUserId.value
      );
    } else {
      const optimisticLike = { member_id: currentUserId.value };
      likes.value.push(optimisticLike);
      const newLike = await addLike(
        boardToTableMapping[boardName],
        postId.value,
        currentUserId.value
      );
      if (!newLike) {
        likes.value.pop();
      }
    }
  } catch (error) {
    console.error("좋아요 상태 변경 중 오류 발생:", error.message);
  }
};

const fetchComments = async () => {
  try {
    comments.value = await getComments(
      boardToTableMapping[boardName],
      postId.value
    );

    console.log(comments.value);
  } catch (error) {
    console.error("댓글 정보를 가져오는 중 오류 발생:", error.message);
  }
};

const isComposing = ref(false);

const handleCompositionStart = () => {
  isComposing.value = true;
};

const handleCompositionEnd = () => {
  isComposing.value = false;
};

const submitComment = async () => {
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

  if (!commentText.value.trim() || isSubmitting.value) return;
  isSubmitting.value = true;
  const commentContent = commentText.value.trim();
  const optimisticComment = {
    id: null,
    post_id: postId.value,
    content: commentContent,
    member_id: currentUserId.value,
    created_at: new Date().toISOString(),
    user_info: {
      name: currentUserName.value,
      image: currentUserImage.value,
    },
  };
  comments.value.push(optimisticComment);
  try {
    const newComment = await createComment(
      boardToTableMapping[boardName],
      currentUserId.value,
      postId.value,
      commentContent
    );
    commentText.value = "";
    optimisticComment.id = newComment[0].id;
    comments.value = comments.value.map((comment) =>
      comment.id === null ? optimisticComment : comment
    );
  } catch (error) {
    console.error("댓글을 생성하는 중 오류 발생:", error.message);
    comments.value.pop();
  } finally {
    isSubmitting.value = false;
  }
};

const handleKeyup = (event) => {
  event.preventDefault();
  if (event.key === "Enter" && !event.shiftKey && !isComposing.value) {
    submitComment();
  }
};

const fetchCurrentUser = async () => {
  try {
    const user = await getCurrentUser();
    currentUserId.value = user?.id || null;
    currentUserName.value = user?.name || null;
    currentUserImage.value = user?.image || null;
  } catch (error) {
    console.error("사용자 정보를 가져오는 중 오류 발생:", error.message);
  }
};

onMounted(async () => {
  try {
    await fetchCurrentUser();
    await Promise.all([fetchComments(), fetchLikes()]);
  } catch (error) {
    console.error("초기 데이터 로드 중 오류 발생:", error.message);
  }
});

const refreshComments = (newComments) => {
  comments.value = newComments;
};
</script>

<template>
  <div class="px-[30px] flex flex-col gap-[30px]">
    <div class="flex gap-[20px]">
      <div class="flex gap-[10px]">
        <button @click="toggleLike">
          <img
            :src="liked ? likeIconFilled : likeIcon"
            alt="좋아요 아이콘"
            class="w-[21px] h-18px"
          />
        </button>
        <span class="text-gray02">{{ likes.length }}</span>
      </div>
      <div class="flex gap-[10px]">
        <img :src="commentIcon" alt="댓글 아이콘" class="w-[21px] h-18px" />
        <span class="text-gray02">{{ comments.length }}</span>
      </div>
    </div>

    <div
      class="border border-gray01 rounded-[10px] px-5 py-[18px] flex justify-between gap-[20px]"
    >
      <input
        type="text"
        placeholder="댓글을 입력해주세요"
        class="w-full outline-none bg-white01"
        v-model="commentText"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
        @keyup="handleKeyup"
      />
      <button @click="submitComment">
        <img
          :src="commentBtnIcon"
          alt="댓글 전송 버튼"
          class="w-[24px] h-[24px]"
        />
      </button>
    </div>

    <div class="flex flex-col gap-5">
      <Commentbox
        v-for="comment in sortedComments"
        :key="comment.id"
        :comment="comment"
        :comments="sortedComments"
        :currentUserId="currentUserId"
        @refresh-comments="refreshComments"
      />
    </div>
  </div>
</template>
