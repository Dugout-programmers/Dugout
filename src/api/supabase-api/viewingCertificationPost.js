import { getCurrentUser } from "./userInfo";
import { supabase } from "@/supabase";

// 특정 클럽의 모든 직관 인증 게시물을 가져오기
export const getViewingCertificationPostsByClub = async (clubId) => {
  try {
    const { data, error } = await supabase
      .from("viewing_certification_post")
      .select(
        "id, content, image, game_date, club_id, title, member_id, name, author_image"
      )
      .eq("club_id", clubId)
      .order("created_at", { ascending: false });

    if (error) throw new Error("게시물 조회 실패");

    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

// 직관 인증 게시물의 상세 정보를 불러오기
// export const getCertificationPostDetailsById = async (postId) => {
//   try {
//     const { data, error } = await supabase
//       .from("viewing_certification_post")
//       .select(
//         "id, created_at, member_id, title, content, club_id, image, game_date, name, author_image"
//       )
//       .eq("id", postId)
//       .single();

//     if (error) {
//       console.error("🚨 데이터 가져오기 실패:", error);
//       return null;
//     }

//     return data;
//   } catch (error) {
//     console.error("게시물 상세 정보 불러오기 실패: ", error);
//     return null;
//   }
// };

// 직관 인증 게시물의 상세 정보를 불러오기
export const getCertificationPostDetailsById = async (postId) => {
  const { data, error } = await supabase.rpc(
    "get_viewing_certification_post_details",
    {
      input_post_id: postId,
    }
  );

  if (error) {
    console.error("Error fetching free post details:", error);
    return null;
  }
  return data;
};

// 직관 인증 게시물 작성하기(생성하기)
export const createCertificationPost = async (
  content,
  image,
  game_date,
  club_id,
  title
) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.log("로그인을 하지 않았습니다");
      return null;
    }

    // 유저 정보 가져오기
    const { data: userInfo, error: userError } = await supabase
      .from("user_info") // 유저 정보 테이블
      .select("name, image")
      .eq("id", user.id)
      .single();

    if (userError) throw new Error("유저 정보를 불러오는 데 실패했습니다.");

    const { data, error } = await supabase
      .from("viewing_certification_post")
      .insert([
        {
          member_id: user.id,
          name: userInfo.name,
          author_image: userInfo.image,
          content,
          image,
          game_date,
          club_id,
          title,
        },
      ])
      .select();

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error("게시물 생성 실패: ", error);
    return null;
  }
};

// supabase storage에 이미지 업로드하기
export const uploadImageToSupabase = async (file) => {
  if (!file) return null;

  const sanitizeFileName = (fileName) => {
    return fileName
      .normalize("NFD") // 유니코드 정규화
      .replace(/[\u0300-\u036f]/g, "") // 결합 문자 제거
      .replace(/[^\w.-]/g, "_") // 특수문자 제거
      .replace(/\s+/g, "_"); // 공백을 밑줄(_)로 변환
  };

  try {
    const sanitizedFileName = `${Date.now()}_${sanitizeFileName(file.name)}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(sanitizedFileName, file);

    if (error) {
      console.error("Supabase 이미지 업로드 실패:", error.message);
      return null;
    }

    // getPublicUrl()을 통해 URL 가져오기
    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(sanitizedFileName);

    if (!publicUrlData) {
      console.error("❌ 퍼블릭 URL을 가져오지 못함");
      return null;
    }

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("이미지 업로드 실패: ", error);
    return null;
  }
};

// 직관 인증 게시물 수정하기
export const updateCertificationPost = async (
  postId, // 수정하려는 게시물의 ID
  content,
  image,
  game_date,
  club_id,
  title
) => {
  try {
    const user = await getCurrentUser();
    if (!user) console.log("로그인을 하지 않았습니다");

    // 게시물의 작성자(member_id)가 현재 사용자와 일치하는지 확인
    const { data: postData, error: fetchError } = await supabase
      .from("viewing_certification_post")
      .select("member_id")
      .eq("id", postId)
      .single();

    if (fetchError) throw new Error("게시물 정보를 가져오는 데 실패했습니다.");
    if (postData.member_id !== user.id)
      throw new Error("본인이 작성한 게시물만 수정할 수 있습니다.");

    // 게시물 수정
    const { data, error } = await supabase
      .from("viewing_certification_post")
      .update({ content, image, game_date, club_id, title })
      .eq("id", postId)
      .select();

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error("게시물 수정 실패: ", error);
    return null;
  }
};

// 직관 인증 게시물 삭제하기
export const deleteCertificationPost = async (postId) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("로그인을 하지 않았습니다.");

    const { data: post, error: fetchError } = await supabase
      .from("viewing_certification_post")
      .select("member_id")
      .eq("id", postId)
      .single(); // 게시물 ID로 하나의 게시물만 가져오기

    if (fetchError) throw new Error("게시물 정보를 가져오는 데 실패했습니다.");
    if (post.member_id !== user.id)
      throw new Error("본인이 작성한 게시물만 삭제할 수 있습니다.");

    const { data, error } = await supabase
      .from("viewing_certification_post")
      .delete()
      .eq("id", postId)
      .eq("member_id", user.id);

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error("게시물 삭제 실패: ", error);
    return null;
  }
};

//사용자 정보 조회하기(게시판 목록 프로필사진, 닉네임 갱신 위해)
export const getUserInfoById = async (member_id) => {
  if (!member_id) return null;

  const { data, error } = await supabase
    .from("user_info")
    .select("id, name, image")
    .eq("id", member_id)
    .single();

  if (error) {
    console.error("유저 정보를 가져오는 데 실패했습니다:", error.message);
    return null;
  }

  return data;
};
