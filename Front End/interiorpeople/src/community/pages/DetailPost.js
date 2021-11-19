import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const DetailPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [user] = useContext(AuthContext);
  const [hasLiked, setHasLiked] = useState(false);
  const [error, setError] = useState(false);
  const [post, setPost] = useState();

  /** 포스트 불러오기 */
  useEffect(() => {
    axios
      .get(`/server/community/post/${postId}`)
      .then(({ data }) => {
        setPost(data);
        setError(false);
      })
      .catch((err) => {
        setError(true);
      });
  }, []);

  /** 좋아요 처리 */
  useEffect(() => {
    if (!post) {
      return;
    }
    if (hasLiked === false) {
      // 좋아요를 누르지 않은 경우
      post.like_num += 1;
    } else {
      // 좋아요를 누른 경우
      post.like_num -= 1;
    }
  }, [hasLiked, post]);

  if (error) {
    return <h3>Error...</h3>;
  } else if (!post) {
    return <h3>Loading...</h3>;
  }

  // const updateImage = (images, currentImage) =>
  //   [
  //     // 기존 이미지는 제외
  //     ...images.filter((image) => image._id !== postId),
  //     currentImage,
  //   ].sort(
  //     // ? 생성일 순으로 정렬
  //     (a, b) =>
  //       // ? a.createAt 는 Number가 아니라서(String) getTime을 이용해 Number 타입으로 변환
  //       {
  //         if (b._id > a._id) {
  //           return 1;
  //         } else {
  //           return -1;
  //         }
  //       }
  //   );

  // TODO : 자신의 포스트는 좋아요 불가
  const likeHandler = async () => {
    try {
      await axios.post(`/server/community/post/${postId}/like`);
      setHasLiked(!hasLiked);
    } catch (err) {
      alert("잠시 후 다시 시도하기 바랍니다.");
    }
  };

  const deleteHandler = async () => {
    try {
      //팝업창이 뜨도록 함 취소를 누르면 false이고 확인은 true임
      if (!window.confirm("삭제하시겠습니까?")) {
        return;
      }
      await axios.delete(`/server/community/post/${postId}/delete`);
      navigate("/community"); // 메인화면으로 복귀
    } catch (err) {}
  };

  /** 포스트의 이미지를 보여주는 함수 */
  const allImagesInPost = post.s3_photo_img_url.map((imageUrl, index) => (
    <img
      key={index}
      src={`/uploads/${imageUrl}`}
      style={{ width: 200, height: 200, objectFit: "cover" }}
      alt=""
      className={`image-preview ${imageUrl && "image-preview-show"}`}
    />
  ));

  return (
    <div>
      <h3>post </h3>
      {allImagesInPost}
      <h2>{post.title}</h2>
      <h3>{post.content}</h3>
      <span>좋아요 {post.like_num}</span>
      <button style={{ float: "right" }} onClick={likeHandler}>
        {hasLiked ? "좋아요 취소" : "좋아요"}
      </button>
      {user && post.writer_id === user && (
        <button
          style={{ float: " right", marginLeft: 10 }}
          onClick={deleteHandler}
        >
          삭제
        </button>
      )}
    </div>
  );
};

export default DetailPost;
