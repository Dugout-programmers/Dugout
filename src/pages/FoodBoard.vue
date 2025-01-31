<script setup>
import { getRestaurantPostsByTagAndClub } from "@/api/supabase-api/restaurantPost";
import FoodBoardCard from "@/components/foodboard/FoodBoardCard.vue";
import { foodBoardTag, teamID } from "@/constants";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import deleteBtn from "../assets/icons/delete-btn.svg";
import GoToCreate from "@/components/common/GoToCreate.vue";
import { useSearchStore } from "@/stores/searchStore";

const route = useRoute();
const searchStore = useSearchStore();
const teamName = ref(route.params.team);
const clubId = ref(teamID[teamName.value]);
const restaurantPosts = ref([]);
const selectedTag = ref(null); // 하나의 태그만 선택되도록 변경

const saveScrollPosition = () => {
  sessionStorage.setItem("foodboard-scroll", window.scrollY.toString());
};

const restoreScrollPosition = () => {
  const savedScroll = sessionStorage.getItem("foodboard-scroll");
  if (savedScroll) {
    window.scrollTo(0, parseInt(savedScroll, 10) || 0);
  }
};


const selectTag = (tag) => {
  if (selectedTag.value === tag) {
    selectedTag.value = null; // 이미 선택된 태그가 클릭되면 선택 해제
  } else {
    selectedTag.value = tag; // 새로운 태그를 선택
  }
};

const postsFilteredWithTag = computed(() => {
  return restaurantPosts.value?.filter(
    (post) => selectedTag.value === null || post.tags.includes(selectedTag.value)
  );
});

const fetchFoodBoardList = async () => {
  try {
    const restaurantPostsData = await getRestaurantPostsByTagAndClub(
      clubId.value,
      selectedTag.value ? [selectedTag.value] : null // 선택된 태그가 있으면 그 태그만 필터링
      );

    return { data: restaurantPostsData, error: null };
  } catch (error) {
    console.error("데이터를 불러오는 도중에 오류가 발생했습니다.");
    return { data: null, error };
  }
};

watch(selectedTag, () => {
  console.log("selectedTag 변경:", selectedTag.value);
  setTimeout(() => {
    restoreScrollPosition();
  }, 0);
});


// 페이지가 로드될 때 데이터를 한 번 불러옴
onMounted(async () => {
  const { data, error } = await fetchFoodBoardList();

  if (error) {
    console.error("데이터를 불러오는 도중에 오류가 발생했습니다.");
  } else {
    restaurantPosts.value = data;
    window.addEventListener("scroll", saveScrollPosition);

    setTimeout(() => {
      restoreScrollPosition();
    }, 0);
  }
});

onBeforeRouteLeave((to, _, next) => {
  if (to.path.includes("/foodboard/")) {
    saveScrollPosition();
  }
  next();
});

onUnmounted(() => {
  if (!route.path.includes("/foodboard/")) {
    saveScrollPosition();
  }
  window.removeEventListener("scroll", saveScrollPosition);
});

// 중복된 postId를 가진 게시물 제거 함수 + 검색
const removeDuplicatePosts = (posts) => {
  const uniquePosts = [];
  const postIds = new Set();

  posts?.forEach((post) => {
    if (!postIds.has(post.id)) {
      uniquePosts.push(post);
      postIds.add(post.id);
    }
  });
  searchStore.setPosts(uniquePosts);
  return searchStore.filteredPosts;
};

watch(
  () => route.params.team,
  (newTeamName, _) => {
    clubId.value = teamID[newTeamName];
    fetchFoodBoardList();
  }
);
</script>

<template>
  <div class="flex flex-col px-[50px] py-[30px] items-center">
    <div class="w-[990px] gap-[50px] flex flex-col">
      <GoToCreate :text="'직관 맛집 공유하기'" />
      <section class="min-h-[39px] overflow-x-auto scrollbar-hide">
        <div class="flex items-center gap-x-[10px] w-max flex-nowrap">
          <button
            v-for="(tag, index) of foodBoardTag"
            :key="index"
            @click="selectTag(tag)"
            class="inline-flex items-center h-[39px] px-[15px] rounded-[10px] whitespace-nowrap"
            :class="{
              'bg-gray02 text-white01 gap-[10px]': selectedTag === tag,
              'bg-white02 text-black01': selectedTag !== tag,
            }"
          >
            <p>{{ tag }}</p>
            <img
              v-if="selectedTag === tag"
              @click.stop="selectTag(tag)"
              :src="deleteBtn"
              class="cursor-pointer"
            />
          </button>
        </div>
      </section>
      <section class="flex flex-col gap-[30px]">
        <!-- 게시물 필터링 후 출력 -->
        <FoodBoardCard
          v-if="postsFilteredWithTag"
          v-for="(restaurantPost, index) in removeDuplicatePosts(postsFilteredWithTag)"
          :key="index"
          :restaurantPostData="restaurantPost"
          :teamName
        />
        <div
            v-else class="flex justify-center"
          >
            <h1>게시물이 없습니다. 게시물을 작성해보세요!</h1>
      </div>
      </section>
    </div>
  </div>
</template>