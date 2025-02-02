<script setup>
import Camera from "@/assets/icons/camera.svg";
import DeletePhoto from "@/assets/icons/delete_photo.svg";
import { supabase } from "@/supabase.js";
import { ref } from "vue";

const props = defineProps({
  images: Array,
});
const emit = defineEmits(["update:images"]);
const errorMessage = ref("");

const uploadImage = async (file, index) => {
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value =
      "파일 크기가 너무 큽니다. 5MB 이하의 파일을 선택해주세요.";
    return;
  } else {
    errorMessage.value = null;
  }

  const fileName = file.name.replace(/[^a-zA-Z0-9]/g, "_");
  const uniqueFileName = `${Date.now()}_${Math.floor(
    Math.random() * 1000
  )}_${fileName}`;

  const uploadPath = `viewing_certification/${uniqueFileName}`;

  try {
    const { data, error } = await supabase.storage
      .from("images")
      .upload(uploadPath, file, {
        cacheControl: "5000",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error("업로드 오류:", error.message);
      errorMessage.value = "이미지 업로드 중 오류가 발생했습니다.";
    } else {
      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(uploadPath);

      if (publicUrlData) {
        const updatedImages = [...props.images];
        updatedImages[index] = publicUrlData.publicUrl;
        emit("update:images", updatedImages);
      } else {
        console.error("공개 URL을 가져오는 데 실패했습니다.");
        errorMessage.value = "이미지 URL을 가져오는 데 실패했습니다.";
      }
    }
  } catch (error) {
    console.error("파일 업로드 중 예외 발생:", error);
    errorMessage.value = "파일 업로드 중 예외가 발생했습니다.";
  }
};

const removeImage = (index) => {
  const newImages = [...props.images];
  newImages[index] = null;
  emit("update:images", newImages);
};

const handleFileChange = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    uploadImage(file, index);
  }
};
</script>
<template>
  <section>
    <div class="flex gap-[30px]">
      <div
        v-for="(imageUrl, i) in props.images"
        :key="i"
        class="cursor-pointer w-full h-full rounded-[10px] bg-white02 aspect-square"
      >
        <!-- 이미지를 업로드한 경우 -->
        <div v-if="imageUrl" class="relative w-full h-full">
          <img
            :src="imageUrl"
            alt="이미 업로드된 이미지"
            class="w-full h-full object-cover rounded-[10px]"
          />
          <img
            :src="DeletePhoto"
            alt="이미 업로드된 이미지를 삭제"
            class="absolute top-[10px] right-[10px] cursor-pointer"
            @click="removeImage(i)"
          />
        </div>

        <!-- 이미지를 업로드하지 않은 경우 -->
        <label
          v-else
          class="relative flex justify-center items-center w-full h-full"
        >
          <img
            :src="Camera"
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
          <input
            type="file"
            class="absolute inset-0 opacity-0 cursor-pointer"
            @change="(event) => handleFileChange(event, i)"
          />
        </label>
      </div>
    </div>
    <div v-if="errorMessage" class="text-red-500 mt-2">
      {{ errorMessage.value }}
    </div>
  </section>
</template>
