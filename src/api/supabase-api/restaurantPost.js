import { supabase } from "@/supabase";

// 게시물 작성
export const createRestaurantPost = async (
  memberId,
  content,
  title,
  thumbnailUrl,
  tags,
  clubId
) => {
  const { data: postData, error: postError } = await supabase
    .from("restaurant_post")
    .insert([
      {
        member_id: memberId,
        content,
        title,
        thumbnail_url: thumbnailUrl,
        tags,
        club_id: clubId,
      },
    ])
    .select();

  if (postError) {
    console.error("Error creating restaurant post:", postError);
    return null;
  }

  return postData;
};

export const createRestaurantLocation = async (
  postId,
  name,
  address,
  category,
  latitude,
  longitude,
  contact,
  url
) => {
  const { data, error } = await supabase
    .from("restaurant_post_location")
    .insert([
      {
        post_id: postId,
        name,
        address,
        category,
        latitude,
        longitude,
        contact,
        url,
      },
    ])
    .select();

  if (error) {
    console.error("Error creating restaurant location:", error);
    return null;
  }

  return data;
};

// update 맛집 게시물 장소 정보
export const updateRestaurantLocation = async (
  postId,
  name,
  address,
  category,
  latitude,
  longitude,
  contact,
  url
) => {
  const { data, error } = await supabase
    .from("restaurant_post_location")
    .update({
      name,
      address,
      category,
      latitude,
      longitude,
      contact,
      url,
    })
    .eq("post_id", postId)
    .select();

  if (error) {
    console.error("Error updating restaurant location:", error);
    return null;
  }

  return data;
};


// 특정 클럽id/ 클럽id + 태그로  맛집 게시물 조회 (SQL로 처리)
// tagName 매개변수가 없으면 알아서 null로 처리되며 클럽으로만 필터링
export const getRestaurantPostsByTagAndClub = async (clubId, tagName) => {
  try {
    const { data, error } = await supabase.rpc(
      "get_restaurant_posts_by_tag_and_club",
      {
        input_club_id: clubId,
        input_tag_name: tagName,
      }
    );

    if (error) {
      throw error;
    }

    return data; // 반환된 데이터
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    throw error;
  }
};

// 게시물의 세부 정보를 가져오는 함수
export const getRestaurantPostDetailsById = async (postId) => {
  try {
    // Supabase에서 RPC 함수 호출
    const { data, error } = await supabase.rpc(
      "get_restaurant_post_details_by_id",
      {
        input_post_id: postId,
      }
    );

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching post details:", error.message);
    throw error;
  }
};

// 맛집 게시물 수정
export const updateRestaurantPost = async (
  postId,
  title,
  content,
  thumbnailUrl,
  tags
) => {
  const { data: postData, error: postError } = await supabase
    .from("restaurant_post")
    .update({ content, title, thumbnail_url: thumbnailUrl, tags: tags })
    .eq("id", postId)
    .select();

  if (postError) {
    console.error("Error updating restaurant post:", postError);
    return null;
  }

  return postData;
};

// 특정 게시물의 tags 수정
export const updateRestaurantPostTags = async (postId, newTags) => {
  const { data, error } = await supabase
    .from("restaurant_post")
    .update({ tags: newTags })
    .eq("id", postId)
    .select();

  if (error) {
    console.error("Error updating restaurant post tags:", error);
    return null;
  }
  return data;
};

// 맛집 게시물 삭제
export const deleteRestaurantPost = async (postId) => {
  const { data, error } = await supabase
  .from("restaurant_post")
  .delete()
  .eq("id", postId);

  if (error) {
    console.error("Error deleting restaurant post:", error);
    return null;
  }

  const { error: tagRecordError } = await supabase
    .from("viewing_restaurant_tag_record")
    .delete()
    .eq("viewing_restaurant_id", postId);

  if (tagRecordError) {
    console.error("Error deleting tag records:", tagRecordError);
    return null;
  }
};
