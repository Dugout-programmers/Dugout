import { supabase } from "@/supabase";

// GET
// Baseball 구단 리스트를 가져오는 함수
export const getBaseballClub = async () => {
  try {
    // Baseball 구단 데이터를 가져오기
    const { data: baseball_club, error } = await supabase
      .from("baseball_club")
      .select()
      .order("id", { ascending: true }); // id값 기준 오름차순

    if (error) {
      console.error("구단 리스트를 불러오지 못했습니다.", error.message);
      return null;
    }
    return baseball_club;
  } catch (err) {
    console.error(
      "구단 리스트를 가져오는 중 알 수 없는 에러가 발생했습니다.",
      err.message
    );
    return null;
  }
};

export const getBaseballClubIdByName = async (clubName) => {
  try {
    // 특정 구단 이름으로 ID 가져오기
    const { data: baseball_club, error } = await supabase
      .from("baseball_club")
      .select("id") 
      .eq("name", clubName); 

    if (error) {
      console.error(
        `구단 ID를 불러오지 못했습니다. 구단 이름: ${clubName}`,
        error.message
      );
      return null;
    }

    if (baseball_club.length === 0) {
      console.warn(`해당 이름의 구단이 존재하지 않습니다: ${clubName}`);
      return null;
    }

    return baseball_club.id; 
  } catch (err) {
    console.error(
      "구단 ID를 가져오는 중 알 수 없는 에러가 발생했습니다.",
      err.message
    );
    return null;
  }
};
