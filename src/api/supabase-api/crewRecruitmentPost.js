import { supabase } from "@/supabase";

// 크루 모집 게시글 생성 함수
export const createCrewRecruitmentPost = async ({
  member_id,
  status,
  game_date,
  author_sex,
  author_age,
  crew_sex,
  crew_age,
  content,
  club_id,
  member_number,
  member_range,
  game_stadium,
}) => {
  try {
    // const {
    //   data: { user },
    //   error: authError,
    // } = await supabase.auth.getUser();

    // if (authError) throw new Error("인증 실패");
    // if (!user) throw new Error("사용자 정보가 없습니다.");

    const { data, error } = await supabase
      .from("crew_recruitment_post")
      .insert({
        member_id, // 유저id
        status, // 모집 상태
        game_date, // 경기 날짜
        author_sex, // 작성자 성별
        author_age, // 작성자 나이
        crew_sex, // 모집 크루 성별
        crew_age, // 모집 크루 나이
        content, // 게시글 내용
        club_id, // 클럽 ID
        member_number, // 모집 인원
        member_range, // 모집인원 (이상, 이하)
        game_stadium, // 경기 장소
      });

    if (error) throw new Error("게시글 생성 실패");
  } catch (err) {
    console.error("Error creating crew recruitment post:", err.message);
    return null;
  }
};

// 게시글 댓글 추가 함수
export const createPostComment = async ({ member_id, post_id, content }) => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError)
      throw new Error("인증 실패: 사용자 정보를 가져오지 못했습니다.");
    if (!user) throw new Error("사용자 정보가 없습니다.");

    const { error } = await supabase
      .from("crew_recruitment_post_comment")
      .insert({
        member_id: member_id || user.id,
        post_id,
        content,
      });

    if (error) throw new Error("댓글 작성 실패");
  } catch (err) {
    console.error("Error adding comment:", err.message);
    return null;
  }
};

// 특정 클럽의 모든 크루 모집 게시물을 가져오기
export const getCrewRecruitmentPostsByClub = async (clubId) => {
  try {
    const { data, error } = await supabase.rpc(
      "get_crew_recruitment_posts_by_club",
      { input_club_id: clubId }
    );

    if (error) throw new Error("특정 클럽의 크루 모집 게시물 조회 실패");

    return data;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

// 특정 크루 모집 게시물의 상세 정보를 불러오는 함수
export const getCrewRecruitmentPostDetails = async (postId) => {
  try {
    const { data, error } = await supabase.rpc(
      "get_crew_recruitment_post_details_by_id",
      { input_post_id: postId }
    );

    if (error) throw new Error("특정 크루 모집 게시물의 상세 정보 조회 실패");

    return data;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

// 특정 게시글 댓글 조회 함수
export const getCrewRecruitmentPostComments = async (postId) => {
  try {
    const { data, error } = await supabase
      .from("crew_recruitment_post_comment")
      .select()
      .eq("post_id", postId);

    if (error) throw new Error("특정 게시글 댓글 조회 실패");
    return data;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};
// 특정 크루 모집 게시글 수정 함수
export const updateCrewRecruitmentPost = async (postId, updatedData) => {
  try {
    const {
      status,
      game_date,
      author_sex,
      author_age,
      crew_sex,
      crew_age,
      content,
      club_id,
      member_number,
      member_range,
      game_stadium,
    } = updatedData;

    const { error } = await supabase
      .from("crew_recruitment_post")
      .update({
        status,
        game_date,
        author_sex,
        author_age,
        crew_sex,
        crew_age,
        content,
        club_id,
        member_number,
        member_range,
        game_stadium,
      })
      .eq("id", postId);

    if (error) throw new Error("게시글 수정 실패");
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

// 특정 댓글 수정 함수
export const updatePostComment = async (commentId) => {
  try {
    const { data, error } = await supabase
      .from("crew_recruitment_post_comment")
      .update({
        content: "저 직관가고시퍼용 진짜수정",
      })
      .eq("id", commentId);
    if (error) throw new Error("댓글 수정 실패");
    return data;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

// 특정 크루 모집 게시글 삭제 함수
export const deleteCrewRecruitmentPost = async (postId) => {
  try {
    const { error } = await supabase
      .from("crew_recruitment_post")
      .delete()
      .eq("id", postId);

    if (error) throw new Error("게시글 삭제 실패");
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

// 특정 댓글 삭제 함수
export const deletePostComment = async (commentId) => {
  const conf = confirm("정말 삭제하시겠습니까?");
  if (!conf) return;

  try {
    const { error } = await supabase
      .from("crew_recruitment_post_comment")
      .delete()
      .eq("id", commentId);

    if (error) throw new Error("댓글 삭제 실패");
  } catch (err) {
    console.error(err.message);
    return null;
  }
};
