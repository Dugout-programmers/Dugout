import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "@/supabase.js";

export const useImageStore = defineStore("image", () => {
  const imageUrls = ref([null, null, null]);
  const errorMessage = ref(null);

  const setImageUrls = (images) => {
    imageUrls.value = [...images, ...Array(3 - images.length).fill(null)].slice(0, 3);
  };

  const uploadImage = async (file, index) => {
    // 파일 크기 제한 체크 (5MB 이하)
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = "파일 크기가 너무 큽니다. 3MB 이하의 파일을 선택해주세요.";
      return;
    } else {
      errorMessage.value = null;
    }

    // 파일 이름에서 한글 및 특수문자를 제거하고, 안전한 파일 이름 생성
    const fileName = file.name.replace(/[^a-zA-Z0-9]/g, '_'); // 한글, 공백, 특수문자를 _로 대체
    const uniqueFileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}_${fileName}`;

    // 업로드 경로 설정 (viewing_certification 폴더)
    const uploadPath = `viewing_certification/${uniqueFileName}`;

    try {
      // 이미지 업로드
      const { data, error } = await supabase.storage
        .from("images") // Supabase의 이미지 버킷
        .upload(uploadPath, file, {
          cacheControl: "5000",
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        // 업로드 중 오류 처리
        console.error("업로드 오류:", error.message);
        errorMessage.value = "이미지 업로드 중 오류가 발생했습니다.";
      } else {
        // 업로드 후 공개 URL 가져오기
        const { data: publicUrlData } = supabase.storage
          .from("images")
          .getPublicUrl(uploadPath);

        if (publicUrlData) {
          console.log("이미지 URL:", publicUrlData.publicUrl);
          imageUrls.value[index] = publicUrlData.publicUrl; // 성공적으로 업로드된 URL 저장
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
    imageUrls.value[index] = null;
  };

  const filterNullImage = () => {
    return imageUrls.value.filter((url) => url !== null);
  };

  const resetImageData = () => {
    imageUrls.value = [null, null, null];
    errorMessage.value = null;
  };

  return {
    imageUrls,
    errorMessage,
    setImageUrls,
    uploadImage,
    removeImage,
    filterNullImage,
    resetImageData,
  };
});
