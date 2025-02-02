<script setup>
import LocationIcon from "@/assets/icons/location_icon.svg";
import { useMapStore } from "@/stores/mapStore";
import { KakaoMap, KakaoMapMarker } from "vue3-kakao-maps";

const mapStore = useMapStore();
const finalSelectedLocation = mapStore.finalSelectedLocation;

// 최종 저장된 장소 변경하기
const returnToMapSelect = () => {
  mapStore.setFinalSelectedLocation(null);
  mapStore.setIsSelectedLocationVisable(false);
};
</script>

<template>
  <section class="w-full h-[374px] bg-white02 border border-white02">
    <!-- finalSelectedLocation이 null이 아닌 경우에만 지도 표시 -->
    <KakaoMap
      v-if="
        finalSelectedLocation &&
        finalSelectedLocation.y &&
        finalSelectedLocation.x
      "
      width="100%"
      height="300"
      :lat="finalSelectedLocation.y"
      :lng="finalSelectedLocation.x"
      :draggable="false"
      :scrollwheel="false"
      @onLoadKakaoMap="onLoadKakaoMap"
    >
      <KakaoMapMarker
        :lat="finalSelectedLocation.y"
        :lng="finalSelectedLocation.x"
      />
    </KakaoMap>
    <!-- finalSelectedLocation이 null일 경우에는 기본 UI를 표시하거나 다른 안내 메시지를 보여줄 수 있음 -->
    <div
      v-else
      class="w-full h-[300px] flex justify-center items-center text-gray-500"
    >
      <p>위치를 선택해 주세요.</p>
    </div>

    <div class="w-full h-[72px] flex items-center bg-white01 px-5">
      <div class="flex flex-1 items-center">
        <img
          :src="LocationIcon"
          alt="위치 아이콘 상세 정보로 이동"
          class="h-30"
        />
        <div class="flex-col ml-[15px]">
          <p class="text-black01 font-semibold text-[18px]">
            {{ finalSelectedLocation?.place_name }}
          </p>
          <p class="text-gray02 text-[14px]">
            {{ finalSelectedLocation?.address_name }}
          </p>
        </div>
      </div>
      <button @click="returnToMapSelect" class="text-gray02 hover:text-black02">
        변경
      </button>
    </div>
  </section>
</template>

<style scoped></style>
