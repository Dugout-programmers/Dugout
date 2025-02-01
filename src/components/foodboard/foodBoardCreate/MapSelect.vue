<script setup>
import DeleteBtn from "@/assets/icons/map_close.svg";
import { useMapStore } from "@/stores/mapStore";
import { computed, ref } from "vue";
import { KakaoMap, KakaoMapMarker } from "vue3-kakao-maps";
import MapSearchBar from "./MapSearchBar.vue";

const mapStore = useMapStore();

// Map 원본 데이터
const coordinate = {
  lat: 37.566826,
  lng: 126.9786567,
}; // 지도 기본값
const map = ref(null);
const markerList = ref([]);
const searchResults = ref([]);
const keyword = ref("");
const overlayVisible = ref(false);
const tempSelectedLocation = computed(() => mapStore.tempSelectedLocation);

// 장소 임시 저장
const updateTempLocation = (newLocation) => {
  mapStore.setTempSelectedLocation(newLocation);
};

// 지도 로드
const onLoadKakaoMap = (mapRef, keyword) => {
  map.value = mapRef;
  if (keyword) searchPlaces(); // 초기 로드시 검색어가 있으면 검색
};

// 장소 검색 콜백
const placesSearchCB = (data, status) => {
  if (status === kakao.maps.services.Status.OK) {
    const bounds = new kakao.maps.LatLngBounds();
    markerList.value = [];
    searchResults.value = data;
    data.forEach((place) => {
      const markerItem = {
        lat: place.y,
        lng: place.x,
        info: place,
      };
      markerList.value.push(markerItem);
      bounds.extend(new kakao.maps.LatLng(Number(place.y), Number(place.x)));
    });
    map.value?.setBounds(bounds);
  } else {
    console.error("검색 결과가 없습니다.");
  }
};

// 검색 실행
const searchPlaces = () => {
  if (!map.value || !keyword.value.trim()) return;
  const ps = new kakao.maps.services.Places();
  ps.keywordSearch(keyword.value, placesSearchCB);
  searchResults.value = []; // 검색 시작 시 초기화
};

// 선택된 장소에 따라 지도 업데이트
const updateMapWithSelectedLocation = (lat, lng, info) => {
  updateTempLocation(info);
  markerList.value = [
    {
      lat,
      lng,
      info,
    },
  ];
  map.value?.setCenter(new kakao.maps.LatLng(lat, lng));
  map.value.setLevel(1);
  overlayVisible.value = true;
};

// 마커 클릭
const onClickMapMarker = (markerItem) => {
  updateMapWithSelectedLocation(
    markerItem.lat,
    markerItem.lng,
    markerItem.info
  );
};

// 검색 결과에서 장소 선택
const onClickSearchResultItem = (place) => {
  updateMapWithSelectedLocation(Number(place.y), Number(place.x), place);
};

// 오버레이 창 닫기
const onClickCloseOverLay = () => {
  overlayVisible.value = false;
};

// 최종 선택 장소 저장
const saveFinalSelectedLocation = () => {
  console.log("장소 저장", tempSelectedLocation.value);
  mapStore.setFinalSelectedLocation(tempSelectedLocation.value);
  updateTempLocation(null);
  mapStore.setIsSelectedLocationVisable(true);
  overlayVisible.value = false;
  searchResults.value = [];
  keyword.value = null;
  console.log("최종 선택 장소 저장", mapStore.finalSelectedLocation)
};

// 카테고리 가공
const getFirstAndLastCategory = (category) => {
  if (!category) return "";
  const categories = category.split(" > ");
  if (categories.length === 1) return categories[0];
  return `${categories[0]} > ${categories[categories.length - 1]}`;
};
</script>

<template>
  <!-- 장소 검색 -->
  <section id="kakaomap-search" class="relative">
    <!-- 지도 부분 -->
    <KakaoMap
      width="100%"
      height="500"
      z-index="-1"
      :lat="coordinate.lat"
      :lng="coordinate.lng"
      :draggable="true"
      @onLoadKakaoMap="onLoadKakaoMap"
    >
      <!-- 검색바 -->
      <MapSearchBar v-model="keyword" @search="searchPlaces" />

      <KakaoMapMarker
        v-for="(marker, index) in markerList"
        :key="marker.key === undefined ? index : marker.key"
        :lat="marker.lat"
        :lng="marker.lng"
        :clickable="true"
        @onClickKakaoMapMarker="onClickMapMarker(marker)"
      />
    </KakaoMap>
    <!-- 검색 결과 리스트 -->
    <div
      v-if="searchResults.length > 0"
      class="absolute top-[50px] left-3 w-[250px] h-[445px] z-10 bg-white overflow-y-auto custom-scrollbar rounded-[10px] shadow-xl"
    >
      <ul v-if="keyword" class="flex flex-col gap-2 p-[20px]">
        <li
          v-for="(place, index) in searchResults"
          :key="index"
          class="cursor-pointer text-black01 hover:text-gray02 mb-[10px] rounded-[10px] w-full group hover:bg-white01 hover:shadow-md hover:p-[10px] hover:rounded-[10px] hover:border-none"
          @click="onClickSearchResultItem(place)"
        >
          <div class="w-full border-b pb-[10px] group-hover:border-none">
            <!-- place_name -->
            <p
              class="text-[18px] font-bold mb-[5px] overflow-hidden text-ellipsis whitespace-nowrap group-hover:whitespace-normal group-hover:overflow-visible"
            >
              {{ place.place_name }}
            </p>
            <!-- address_name -->
            <p
              class="text-[14px] overflow-hidden text-ellipsis whitespace-nowrap group-hover:whitespace-normal group-hover:overflow-visible"
            >
              {{ place.address_name }}
            </p>
          </div>
        </li>
      </ul>

      <div v-else>
        <div
          class="h-[375px] flex flex-col justify-center items-center m-[20px] text-gray01"
        >
          <p>아직 검색 결과가 없습니다</p>
          <p class="text-center">
            <br />
            Enter를 누르거나 <br />다른 검색어로 바꿔주세요
          </p>
        </div>
      </div>
    </div>

    <!-- 커스텀 오버레이 -->
    <div
      v-if="overlayVisible"
      class="w-[250px] p-[20px] bg-white01 rounded-[10px] z-50 absolute top-[50px] right-3 shadow-md flex flex-col gap-[10px] group"
    >
      <div class="flex flex-col gap-[5px] relative">
        <span
          @click="onClickCloseOverLay"
          class="absolute right-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <img :src="DeleteBtn" />
        </span>
        <p class="text-[18px] font-bold">
          {{ tempSelectedLocation.place_name }}
        </p>
        <p class="leaing-[18px] text-[14px] text-gray03 line-clamp">
          {{ tempSelectedLocation.phone }}
        </p>
        <p class="leaing-[18px] text-[14px] text-gray03 line-clamp">
          {{ tempSelectedLocation.address_name }}
        </p>
      </div>
      <p
        class="leading-[18px] text-[14px] text-black01 overflow-hidden line-clamp"
      >
        {{ getFirstAndLastCategory(tempSelectedLocation.category_name) }}
      </p>
      <p class="leading-[18px] text-[14px] text-[#4B96F3] underline font-bold">
        <a :href="tempSelectedLocation.place_url" target="_blank"
          >지도 보러가기</a
        >
      </p>
      <button
        @click="saveFinalSelectedLocation"
        class="h-10 bg-white02 rounded-[10px] font-bold"
      >
        공유할 맛집으로 선택
      </button>
    </div>
  </section>
</template>

<style scoped>
/* 스크롤바 커스텀 */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px; /* 스크롤바 너비 */
  height: 8px; /* 가로 스크롤바 높이 */
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f0f0f0; /* 스크롤바 트랙 배경 */
  border-radius: 4px; /* 둥글게 */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: white; /* 스크롤바 색상 */
  border-radius: 4px; /* 둥글게 */
  border: 2px solid #f0f0f0; /* 트랙과의 간격 */
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0; /* 호버 시 스크롤바 색상 */
}
</style>
