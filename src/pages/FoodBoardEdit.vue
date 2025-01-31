<script setup>
import CreateHeader from '@/components/CreateHeader.vue';
import PhotoUpload from '@/components/foodboard/foodBoardCreate/PhotoUpload.vue';
import MapSelectAndView from '@/components/foodboard/foodBoardCreate/MapSelectAndView.vue';
import TagsSelect from '@/components/foodboard/foodBoardCreate/TagsSelect.vue';
import { QuillEditor } from '@vueup/vue-quill';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { getRestaurantPostDetailsById, updateRestaurantLocation, updateRestaurantPost } from '@/api/supabase-api/restaurantPost';
import { updateRestaurantPostImage } from '@/api/supabase-api/restaurantImage';
import { useMapStore } from '@/stores/mapStore';
import { useImageStore } from '@/stores/useImageStore';
import { useModalStore } from '@/stores/useModalStore';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()
const imageStore = useImageStore();
const mapStore = useMapStore();
const router = useRouter();
const modalStore = useModalStore();
const route = useRoute();
const postId = route.params.id;
const teamName = ref(route.params.team);

const postDetails = ref({})
const title = ref("");
const content = ref("");
const selectedTags = ref([]);
const location = ref({})


const tagErrorClass = ref("");
const tagErrorMessage = ref("태그를 1개 이상 선택해주세요");

const loadPostDetail = async () => {
  try {
    const data = await getRestaurantPostDetailsById(postId);
    postDetails.value = {
    ...data,
    images: data.images?.map((img) => img.url),
    };

    if (postDetails.value.member_id !== authStore.user?.id) {
      router.push({ name: "NotFound" });  // NotFound 페이지로 리디렉션
      return; 
    }
    
    title.value = postDetails.value.title;
    content.value = postDetails.value.content;
    selectedTags.value = postDetails.value.tags;
    location.value = postDetails.value.location

    mapStore.setFinalSelectedLocation({place_name:location.value.name,address_name:location.value.address,category_name: location.value.category, x: location.value.longitude, y: location.value.latitude, phone: location.value.contact, place_url: location.value.url})
    mapStore.setIsSelectedLocationVisable(true);
    imageStore.setImageUrls(postDetails.value.images);

    console.log("디테일 데이터 출력", postDetails.value)
  } catch (error) {
    console.error("게시물 불러오기 실패", error);
  }
};

onMounted(async() => {
   await loadPostDetail();
});

const handleTagUpdate = (tags) => {
  selectedTags.value = tags;
  if (selectedTags.value.length > 0) {
    tagErrorClass.value = "";
  }
};

const handlePostUpdate = async () => {
  if (!isValidForm()) return;

  console.log("장소 데이터 제대로 들어갔는지 location.value", location.value);

  try {
    await updateRestaurantPost(postId, title.value, content.value, imageStore.filterNullImage()[0], selectedTags.value);
    getFinalLocation()
    const { name, address, category, longitude, latitude, contact, url } = location.value;
    await updateRestaurantLocation(postId, name, address, category, latitude, longitude, contact, url);
    await uploadImages();
    router.push(`/${teamName.value}/foodboard`);
    imageStore.resetImageData();
    mapStore.resetLocationData();
  } catch (error) {
    console.error("게시물 수정 실패", error);
  }

};

const getFinalLocation = () => {
  const finalSelectedLocation = mapStore.finalSelectedLocation;
    location.value = {
      name: finalSelectedLocation.place_name,
      address: finalSelectedLocation.address_name,
      category: finalSelectedLocation.category_name,
      longitude: finalSelectedLocation.x,
      latitude: finalSelectedLocation.y,
      contact: finalSelectedLocation.phone,
      url: finalSelectedLocation.place_url
    };
}

const isValidForm = () => {
  if (!title.value.trim()) {
    focusElement('input[type="text"]');
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
  const images = imageStore.filterNullImage();
  for (const [i, image] of images.entries()) {
    try {
      const imageData = await updateRestaurantPostImage(postId, i, image);
      console.log("이미지 업로드 성공", imageData);
    } catch (err) {
      console.error(`이미지 업로드 실패 (index: ${i})`, err);
    }
  }
};

const onClickCompleteEdit = () => {
  modalStore.openModal({
    message: "수정을 완료하시겠습니까?",
    type: "twoBtn",
    onConfirm: () => {
      handlePostUpdate()
      modalStore.closeModal();
      router.go(-1)
    },
    onCancel: modalStore.closeModal,
  });
}

const cancelRestaurantPost = () => {
  router.go(-1);
  mapStore.resetLocationData();
};
</script>

<template>
  <section class="flex flex-col items-center">
    <div class="w-[1090px] flex flex-col">
      <CreateHeader :handleRegister="onClickCompleteEdit" :handleCancel="cancelRestaurantPost" />
      <div>
        <input
          v-model="title"
          type="text"
          placeholder="제목"
          class="border-b w-full outline-none text-center py-[15px] text-3xl bg-white01"
        />
      </div>
      <section id="post_content--input" class="flex flex-col gap-[30px] mb-[142px] w-full">
        <MapSelectAndView />
        <div class="w-full border border-white02">
          <QuillEditor
            v-model:content="content"
            contentType="html"
            :placeholder="'맛집을 마구 공유해주세요!\n맛집 사진은 최대 3개까지 업로드할 수 있습니다.'"
            theme="snow"
          />
        </div>
        <PhotoUpload />
        <div id="tags-select" class="flex flex-col gap-[20px]">
          <div class="flex gap-[10px] items-center">
            <p :class="tagErrorClass" class="text-[14px] text-gray03">{{ tagErrorMessage }}</p>
          </div>
          <TagsSelect :initial-tags="selectedTags" @update:selectedTag="handleTagUpdate" />
        </div>
      </section>
    </div>
  </section>
</template>
