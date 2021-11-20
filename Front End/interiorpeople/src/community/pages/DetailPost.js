import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Cookies from "universal-cookie";

const DetailPost = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const { postId } = useParams();
  const [user] = useContext(AuthContext);
  const [hasLiked, setHasLiked] = useState(null);
  const [hasScraped, setHasScraped] = useState(null);
  const [error, setError] = useState(false);
  const [post, setPost] = useState();

  useEffect(() => {
    /** 포스트 불러오기 */
    axios
      .get(`/server/community/post/${postId}`)
      .then(({ data }) => {
        setPost(data);
        setError(false);
      })
      .catch((err) => {
        setError(true);
      });
    /** 좋아요 불러오기 */
    if (user || cookies.get("loginData")) {
      axios
        .get(`/server/community/post/${postId}/like-check`)
        .then((result) => {
          if (result.data.message === "like") {
            setHasLiked(true);
          } else {
            setHasLiked(false);
          }
        })
        .catch((err) => alert("좋아요 불러오기 에러가 발생했습니다."));
      /** 스크랩 불러오기 */
      axios
        .get(`/server/community/post/${postId}/scrape-check`)
        .then((result) => {
          if (result.data.message === "scrape") {
            setHasScraped(true);
          } else {
            setHasScraped(false);
          }
        })
        .catch((err) => alert("스크랩 불러오기 에러가 발생했습니다."));
    }
    /** 팔로잉 불러오기 */
  }, [postId]);

  if (error) {
    return <h3>Error...</h3>;
  } else if (!post) {
    return <h3>Loading...</h3>;
  }

  /** 좋아요 핸들러 */
  const likeHandler = async () => {
    try {
      await axios.post(`/server/community/post/${postId}/like`);
      if (hasLiked === false) {
        // 좋아요를 누르지 않은 경우
        post.like_num += 1;
      } else {
        // 좋아요를 누른 경우
        post.like_num -= 1;
      }
      setHasLiked(!hasLiked);
    } catch (err) {
      alert("잠시 후 다시 시도하기 바랍니다.");
    }
  };

  /** 스크랩 핸들러 */
  const scrapeHandler = async () => {
    try {
      await axios.post(`/server/community/post/${postId}/scrape`);
      setHasScraped(!hasScraped);
    } catch (err) {
      alert("잠시 후 다시 시도하기 바랍니다.");
    }
  };

  /** 포스트 삭제 핸들러 */
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
      <h3>{post.writer_id}</h3>
      <h3>{post.content} </h3>
      <span>좋아요 {post.like_num}</span>
      {!user || user === post.writer_id ? (
        <></>
      ) : (
        <div>
          <button style={{ float: "right" }} onClick={likeHandler}>
            {hasLiked !== null && (hasLiked ? "좋아요 취소" : "좋아요")}
          </button>
          <button style={{ float: "right" }} onClick={scrapeHandler}>
            {hasScraped !== null && (hasScraped ? "스크랩 취소" : "스크랩")}
          </button>
        </div>
      )}
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
