import { supabase } from "@/supabase";

// CREATE
// 새 Baseball 게임 기록을 생성하는 함수
export const createBaseballGame = async ({ member_id }) => {
  try {
    // 현재 인증된 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw new Error("사용자 인증에 실패했습니다.");
    if (!user) throw new Error("로그인된 사용자가 없습니다.");

    // 새로운 게임 기록 생성
    const { error } = await supabase.from("baseball_game_record").insert({
      member_id: member_id || user.id,
      wins: 0, // 기본 값 0
    });

    if (error)
      throw new Error("Baseball 게임 기록 생성 중 문제가 발생했습니다.");
  } catch (err) {
    console.error("CREATE ERROR:", err.message);
    return null;
  }
};

// GET
// 모든 Baseball 게임 기록을 가져오는 함수
export const getBaseballGame = async () => {
  try {
    // Baseball 게임 기록을 가져오기 (승리 수 기준 내림차순)
    const { data, error } = await supabase
      .from("baseball_game_record")
      .select()
      .order("wins", { ascending: false }); // wins 값 기준 내림차순

    if (error)
      throw new Error(
        "Baseball 게임 기록을 가져오는 중 문제가 발생했습니다. 다시 시도해주세요."
      );
    return data;
  } catch (err) {
    console.error("GET ERROR:", err.message);
    return null;
  }
};

// UPDATE
// 현재 사용자의 Baseball 게임 기록을 업데이트하는 함수
export const updateBaseballGame = async (userId) => {
  try {
    // 현재 사용자의 게임 기록 가져오기
    const { data: records, error: fetchError } = await supabase
      .from("baseball_game_record")
      .select("wins")
      .eq("member_id", userId)
      .single();

    if (fetchError) throw new Error("기존 기록을 가져오는 데 실패했습니다.");

    // 기존 wins 값에 1 추가
    const updatedWins = records.wins + 1;

    // 업데이트 요청
    const { data, error: updateError } = await supabase
      .from("baseball_game_record")
      .update({ wins: updatedWins })
      .eq("member_id", userId);

    if (updateError)
      throw new Error(
        "Baseball 게임 기록 업데이트 중 문제가 발생했습니다. 다시 시도해주세요."
      );
  } catch (err) {
    console.error("UPDATE ERROR:", err.message);
    return null;
  }
};
