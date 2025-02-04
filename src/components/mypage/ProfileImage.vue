<script setup>
import Camera from "@/assets/icons/camera.svg";
import DefaultProfile from "@/assets/icons/default_profile_xl.svg";
import { teamColors } from "@/constants/index";
import { supabase } from "@/supabase.js";
import { defineEmits, defineProps, ref } from "vue";
const props = defineProps({
  isEditingProfile: Boolean,
  profileImage: String,
  profileTeam: String,
  tempImage: String,
});

const emit = defineEmits(["update:image"]);
const errorMessage = ref("");

const handleProfileImageUpload = async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value =
        "파일 크기가 너무 큽니다. 5MB 이하의 파일을 선택해주세요.";
      return;
    } else {
      errorMessage.value = "";
    }

    const fileName = file.name.replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueFileName = `${Date.now()}_${Math.floor(
      Math.random() * 1000
    )}_${fileName}`;
    const uploadPath = `profile_images/${uniqueFileName}`;

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
          emit("update:image", publicUrlData.publicUrl);
        } else {
          console.error("공개 URL을 가져오는 데 실패했습니다.", error);
          errorMessage.value = "이미지 URL을 가져오는 데 실패했습니다.";
        }
      }
    } catch (error) {
      console.error("파일 업로드 중 예외 발생:", error);
      errorMessage.value = "파일 업로드 중 예외가 발생했습니다.";
    }
  };

  input.click();
};
</script>

<template>
  <div
    class="w-[240px] h-[240px] rounded-full sticky flex flex-shrink-0 outline outline-gray01"
    :style="
      !props.isEditingProfile && props.profileTeam
        ? { outline: `5px solid ${teamColors[props.profileTeam]}` }
        : {}
    "
  >
    <figure class="relative w-[240px] h-[240px]">
      <img
        v-if="!props.isEditingProfile"
        :src="props.profileImage || DefaultProfile"
        alt="프로필 사진"
        class="w-full h-full rounded-full object-cover"
        :class="{
          'outline outline-1 outline-gray02': !props.profileImage,
        }"
      />
      <div v-else class="relative w-full h-full">
        <!-- 프로필 이미지 -->
        <img
          :src="props.tempImage || props.profileImage"
          class="w-full h-full rounded-full object-cover"
        />

        <!-- 검은색 오버레이 -->
        <button
          @click="handleProfileImageUpload"
          class="absolute inset-0 bg-black opacity-50 rounded-full flex justify-center items-center"
        >
          <!-- 카메라 아이콘 -->
          <img
            :src="Camera"
            alt="프로필 사진 수정 버튼"
            class="w-[50px] h-[50px] absolute"
          />
        </button>
      </div>
    </figure>
  </div>
  <div v-if="errorMessage" class="text-red-500 mt-2">
    {{ errorMessage }}
  </div>
</template>
