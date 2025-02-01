import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useSearchStore = defineStore("search", () => {
  const keyword = ref(""); // 검색어 상태
  const allPosts = ref([]); // 모든 게시물 데이터 저장

  // 검색어 설정
  const setKeyword = (value) => {
    keyword.value = value;
  };

  // 게시물 데이터 설정 (API 호출 후 저장)
  const setPosts = (posts) => {
    allPosts.value = posts;
  };

  // 한글을 초성, 중성, 종성으로 분리하는 함수
  const splitHangul = (char) => {
    const code = char.charCodeAt(0) - 0xac00;
    if (code < 0 || code > 11171) return null; // 한글이 아닌 경우

    const cho = Math.floor(code / 588);
    const jung = Math.floor((code - cho * 588) / 28);
    const jong = code % 28;

    return { cho, jung, jong };
  };

  // 한글 마지막 글자 검색을 위한 함수
  const matchLastHangulChar = (text, search) => {
    // 검색어의 마지막 글자 확인
    const lastChar = search[search.length - 1];
    const lastCharCode = lastChar.charCodeAt(0);

    // 마지막 글자가 한글인 경우
    if (lastCharCode >= 0xAC00 && lastCharCode <= 0xD7A3) {
      const { cho, jung, jong } = splitHangul(lastChar);

      // 텍스트의 마지막 글자와 검색어의 마지막 글자가 동일한지 확인
      const textLastChar = text[text.length - 1];
      const textLastCharCode = textLastChar.charCodeAt(0);

      if (textLastCharCode >= 0xAC00 && textLastCharCode <= 0xD7A3) {
        const { cho: textCho, jung: textJung, jong: textJong } = splitHangul(textLastChar);

        // 초성, 중성, 종성이 일치하는지 확인
        return cho === textCho && jung === textJung && jong === textJong;
      }
    }

    // 한글이 아닌 경우에는 문자 그대로 비교
    return text.includes(search);
  };

  // 검색어로 필터링된 게시물 반환
  const filteredPosts = computed(() => {
    if (!keyword.value.trim()) return allPosts.value;

    const lowerKeyword = keyword.value.toLowerCase();
    const keywords = lowerKeyword.split(" "); // 다중 키워드 검색 지원

    return allPosts.value
      .filter((post) => {
        const title = post.title.toLowerCase();
        const content = post.content.toLowerCase();

        // 대소문자 무시하고 다중 키워드 포함 여부 확인
        const matches = keywords.every(
          (kw) => title.includes(kw) || content.includes(kw) || matchLastHangulChar(title, kw)
        );

        return matches;
      })
      .sort((a, b) => {
        // 제목에 키워드 포함되면 우선순위 높이기
        const aTitleMatch = keywords.some((kw) => a.title.toLowerCase().includes(kw));
        const bTitleMatch = keywords.some((kw) => b.title.toLowerCase().includes(kw));

        return bTitleMatch - aTitleMatch; // true(1) > false(0)
      });
  });

  return { keyword, setKeyword, allPosts, setPosts, filteredPosts };
});
