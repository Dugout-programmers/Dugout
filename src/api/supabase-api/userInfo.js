import { supabase } from "@/supabase";

// 현재 로그인 사용자 정보 불러오기
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("사용자 정보를 가져오는 중 오류 발생:", error);
      return null;
    }

    if (user) {
      // user_info 테이블에서 추가 정보 가져오기
      const { data: userInfo, error: userInfoError } = await supabase
        .from("user_info")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userInfoError) {
        console.error(
          "사용자 추가 정보를 가져오는 중 오류 발생:",
          userInfoError
        );
        // 기존 값 유지를 위해 user_info 테이블 다시 조회
        const { data: existingInfo } = await supabase
          .from("user_info")
          .select("*")
          .eq("id", user.id)
          .single();

        return {
          ...user,
          name: existingInfo?.name || user.user_metadata?.name || null,
          description: existingInfo?.description || null,
          image: existingInfo?.image || null,
          baseball_club_id: existingInfo?.baseball_club_id || null,
        };
      }

      // auth 정보와 user_info 정보 합치기
      return {
        ...user,
        name: userInfo.name || user.user_metadata?.name || null,
        description: userInfo.description || null,
        image: userInfo.image || null,
        baseball_club_id: userInfo.baseball_club_id || null,
      };
    }

    return null;
  } catch (err) {
    console.error("알 수 없는 오류 발생:", err);
    return null;
  }
};

// 사용자 정보 불러오기
export const getUserInfoEnCapsulation = async (table) => {
  let { data, error } = await supabase.from(table).select("*");
  if (error) throw new Error(error.message);
  return data;
};

// 사용자 정보 수정
export const updateUserInfoEnCapsulation = async (userId, updateData) => {
  const allowedFields = ["name", "description", "image", "baseball_club_id"];

  // 유효한(변경 가능한) 필터만 필터링
  const filteredData = Object.keys(updateData)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = updateData[key];
      return obj;
    }, {});

  // 필터링된 데이터가 없으면 에러 반환
  if (Object.keys(filteredData).length === 0) {
    return { success: false, error: "No Valid Fields To Update" };
  }

  try {
    // supabase를 통해 데이터 업데이트
    const { data, error } = await supabase
      .from("user_info")
      .update(filteredData)
      .eq("id", userId)
      .select();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: "Unexpected Error In UpdateUserInfo",
      details: error,
    };
  }
};
