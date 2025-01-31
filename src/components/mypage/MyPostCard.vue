<script setup>
import { KakaoMap, KakaoMapMarker } from "vue3-kakao-maps";
import defaultImg from "@/assets/images/defaultImg_sm.svg";
import lgMascot from "@/assets/images/mascot_lg.svg";
import doosanMascot from "@/assets/images/mascot_doosan.svg";
import kiwoomMascot from "@/assets/images/mascot_kiwoom.svg";  
import ssgMascot from "@/assets/images/mascot_ssg.svg";        
import ncMascot from "@/assets/images/mascot_nc1.svg";          
import kiaMascot from "@/assets/images/mascot_kia1.svg";        
import hanhwaMascot from "@/assets/images/mascot_hanhwa.svg";  
import lotteMascot from "@/assets/images/mascot_lotte1.svg";    
import samsungMascot from "@/assets/images/mascot_samsung.svg";
import ktMascot from "@/assets/images/mascot_kt.svg";          

const mascort = {
  lg: lgMascot,
  doosan: doosanMascot,
  kiwoom: kiwoomMascot,
  ssg: ssgMascot,
  nc: ncMascot,
  kia: kiaMascot,
  hanhwa: hanhwaMascot,
  lotte: lotteMascot,
  samsung: samsungMascot,
  kt: ktMascot,
};

const props = defineProps({
  displayedData: {
    type: Array,
  },
});

const imageClass = "w-full h-full object-cover rounded-[10px] flex justify-center items-center";
</script>

<template>
  <div v-for="post in props.displayedData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )" :key="`${post.post_type}${post.id}`" class="w-full aspect-square flex flex-col justify-center items-center border border-1 rounded-[10px] border-whiteDark text-[14px] text-gray relative overflow-hidden group">
    <RouterLink :to="`/${post.club_eng_name}/${post.post_type}/${post.post_id}`" class="w-full h-full object-cover rounded-[10px]">
      <figure v-if="post.thumbnail_url" :class="imageClass">
        <img :src="post.thumbnail_url" :class="imageClass"/>
      </figure>
      <div v-else-if="post.lat && post.lng" class="w-full h-full object-cover">
        <KakaoMap :style="{ width: '100%', height: '100%' }" :lat="post.lat" :lng="post.lng" :draggable="false" :scrollwheel="false" @onLoadKakaoMap="onLoadKakaoMap">
          <KakaoMapMarker :lat="post.lat" :lng="post.lng"/>
        </KakaoMap>
      </div>
      <figure v-else-if="post.post_type === 'crewboard'" :class="imageClass">
        <img :src="mascort[post.club_eng_name] || mascort.lg" class="h-40 opacity-50"/>
      </figure>
      <figure v-else :class="imageClass">
        <img :src="defaultImg" :class="imageClass">
      </figure>
      <div class="absolute inset-0 flex justify-center items-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 p-5">
        <span class="text-white text-[18px]">{{ post.post_title || '제목 없음' }}</span>
      </div>
    </RouterLink>
  </div>
</template>

<style scoped>
.group:hover::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3); 
  z-index: 1;
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.group .absolute {
  z-index: 2; /* 텍스트가 배경 위에 보이도록 */
}
</style>
