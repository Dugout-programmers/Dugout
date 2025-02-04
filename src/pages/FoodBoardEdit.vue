<script setup>
import {
  checkIfImageExists,
  createRestaurantPostImage,
  deleteRestaurantPostImage,
  updateRestaurantPostImage,
} from "@/api/supabase-api/restaurantImage";
import {
  getRestaurantPostDetailsById,
  updateRestaurantLocation,
  updateRestaurantPost,
} from "@/api/supabase-api/restaurantPost";
import Baseball from "@/assets/icons/baseball.svg";
import CreateHeader from "@/components/common/CreateHeader.vue";
import MapSelectAndView from "@/components/foodboard/foodBoardCreate/MapSelectAndView.vue";
import PhotoUpload from "@/components/foodboard/foodBoardCreate/PhotoUpload.vue";
import TagsSelect from "@/components/foodboard/foodBoardCreate/TagsSelect.vue";
import { useAuthStore } from "@/stores/auth";

import Loading from "@/components/common/Loading.vue";
import { useModalStore } from "@/stores/useModalStore";
import { QuillEditor } from "@vueup/vue-quill";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const isLoading = ref(true);

const authStore = useAuthStore();

const router = useRouter();
const modalStore = useModalStore();
const route = useRoute();
const postId = route.params.id;
const teamName = ref(route.params.team);

const tagErrorClass = ref("");
const tagErrorMessage = ref("태그를 1개 이상 선택해주세요");

const postDetails = ref({});
const title = ref("");
const location = ref({});
const content = ref("");
const imageUrls = ref([null, null, null]);
const selectedTags = ref([]);
const finalSelectedLocation = ref({});
const isMapViewVisable = ref(true);
// 기존 포스트 로드
const loadPostDetail = async () => {
  const data = await getRestaurantPostDetailsById(postId);

  if (!data) throw new Error("게시물 데이터를 가져올 수 없습니다.");

  const {
    title: postTitle,
    content: postContent,
    tags,
    location: postLocation,
    member_id,
    images,
  } = data;

  if (member_id !== authStore.user?.id) {
    return router.push({ name: "NotFound" });
  }

  postDetails.value = {
    ...data,
    images: images?.map((img) => img.url) || [],
  };

  title.value = postTitle;
  content.value = postContent;
  selectedTags.value = tags || [];
  location.value = postLocation || {};

  finalSelectedLocation.value = {
    place_name: location.value.name || "",
    address_name: location.value.address || "",
    category_name: location.value.category || "",
    x: location.value.longitude || "",
    y: location.value.latitude || "",
    phone: location.value.contact || "",
    place_url: location.value.url || "",
  };

  const loadedImages = postDetails.value.images;
  imageUrls.value = [
    ...loadedImages,
    ...Array(3 - loadedImages.length).fill(null),
  ].slice(0, 3);
  isLoading.value = false;
};

onMounted(loadPostDetail);

const updateImages = (newImages) => {
  imageUrls.value = newImages;
};

const updateTags = (tags) => {
  selectedTags.value = tags;
  if (selectedTags.value.length > 0) {
    tagErrorClass.value = "";
  }
};

const registerEditedPost = async () => {
  const filteredUrls = imageUrls.value.filter((url) => url !== null);
  try {
    isLoading.value = true;
    // 첫 번째 이미지가 없다면 null을 전달
    await updateRestaurantPost(
      postId,
      title.value,
      content.value,
      filteredUrls[0] || null,
      selectedTags.value
    );

    getFinalLocation();
    const { name, address, category, longitude, latitude, contact, url } =
      location.value;

    await updateRestaurantLocation(
      postId,
      name,
      address,
      category,
      latitude,
      longitude,
      contact,
      url
    );
    await uploadImages(); // 이미지 업로드 후 다시 저장
    router.push(`/${teamName.value}/foodboard`);
    finalSelectedLocation.value = null;
  } catch (error) {
    console.error("게시물 수정 실패", error);
  } finally {
    isLoading.value = false;
  }
};

const updateFinalLocation = (newLocation) => {
  finalSelectedLocation.value = newLocation;
};

const getFinalLocation = () => {
  const newLocation = finalSelectedLocation.value;
  location.value = {
    name: newLocation.place_name,
    address: newLocation.address_name,
    category: newLocation.category_name,
    longitude: newLocation.x,
    latitude: newLocation.y,
    contact: newLocation.phone,
    url: newLocation.place_url,
  };
};

const isValidForm = () => {
  if (!title.value.trim()) {
    focusElement(".title-input");
    return false;
  }

  if (!content.value.trim()) {
    focusElement(".ql-editor");
    return false;
  }

  if (selectedTags.value.length === 0) {
    handleTagError();
    return false;
  }

  return true;
};

const focusElement = (selector) => {
  const element = document.querySelector(selector);
  if (element) {
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const handleTagError = () => {
  tagErrorClass.value = "error";
  const tagsSelectElement = document.getElementById("tags-select");
  if (tagsSelectElement) {
    tagsSelectElement.scrollIntoView({ behavior: "smooth" });
  }
  setTimeout(() => {
    tagErrorClass.value = "";
  }, 3000);
};

const uploadImages = async () => {
  try {
    for (let i = 0; i < imageUrls.value.length; i++) {
      const image = imageUrls.value[i];
      const existingImage = await checkIfImageExists(postId, i);
      if (existingImage && !image) {
        await deleteRestaurantPostImage(postId, i);
      } else if (existingImage && image) {
        await updateRestaurantPostImage(postId, i, image);
      } else if (!existingImage && image) {
        await createRestaurantPostImage(postId, image, i);
      }
    }
  } catch (err) {
    console.error("이미지 업로드 실패", err);
  }
};

const onClickCompleteEdit = () => {
  if (!isValidForm()) return;

  modalStore.openModal({
    message: "수정을 완료하시겠습니까?",
    type: "twoBtn",
    onConfirm: () => {
      registerEditedPost();
      modalStore.closeModal();
      router.go(-1);
    },
    onCancel: modalStore.closeModal,
  });
};

const cancelRestaurantPost = () => {
  router.go(-1);
};
</script>

<template>
  <Loading v-if="isLoading" />
  <section class="flex flex-col">
    <div class="w-[1090px] flex flex-col mx-auto">
      <CreateHeader
        :handleRegister="onClickCompleteEdit"
        :handleCancel="cancelRestaurantPost"
      />
      <div>
        <input
          v-model="title"
          type="text"
          placeholder="제목"
          class="border-b w-full outline-none text-center py-[15px] text-3xl bg-white01 title-input"
        />
      </div>
      <section
        id="post_content--input"
        class="flex flex-col gap-[30px] mb-[142px] w-full"
      >
        <MapSelectAndView
          :finalSelectedLocation="finalSelectedLocation"
          :isMapViewVisable="isMapViewVisable"
          @updateFinalLocation="updateFinalLocation"
        />
        <div class="w-full border border-white02">
          <QuillEditor
            v-model:content="content"
            contentType="html"
            :placeholder="'맛집을 마구 공유해주세요!\n맛집 사진은 최대 3개까지 업로드할 수 있습니다.'"
            theme="snow"
          />
        </div>
        <PhotoUpload :images="imageUrls" @update:images="updateImages" />
        <div id="tags-select" class="flex flex-col gap-[20px]">
          <div class="flex gap-[10px] items-center">
            <img :src="Baseball" class="w-[18px] h-[18px]" />
            <p :class="tagErrorClass" class="text-[14px] text-gray03">
              {{ tagErrorMessage }}
            </p>
          </div>
          <TagsSelect
            :initial-tags="selectedTags"
            @update:selectedTag="updateTags"
          />
        </div>
      </section>
    </div>
  </section>
</template>
