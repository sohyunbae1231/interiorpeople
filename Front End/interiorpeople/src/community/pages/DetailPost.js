import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const DetailPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [user] = useContext(AuthContext);
  const [hasLiked, setHasLiked] = useState(null);
  const [hasScraped, setHasScraped] = useState(null);
  const [hasFollowed, setHasFollowed] = useState(null);
  const [error, setError] = useState(false);
  const [post, setPost] = useState();
  const [comments, setComments] = useState();

  useEffect(() => {
    try {
      /** 포스트 불러오기 */
      axios.get(`/server/community/post/${postId}`).then((result) => {
        setPost(result.data.post);
        setError(false);

        /** 좋아요, 북마크, 팔로우 여부 체크 */
        if (user || cookies.get("loginData")) {
          // 좋아요
          if (result.data.checkResult.likeCheckResult === "like") {
            setHasLiked(true);
          } else {
            setHasLiked(false);
          }

          // 북마크
          if (result.data.checkResult.scrapeCheckResult === "scrape") {
            setHasScraped(true);
          } else {
            setHasScraped(false);
          }

          // 팔로우
          if (result.data.checkResult.followCheckResult === "follow") {
            setHasFollowed(true);
          } else {
            setHasFollowed(false);
          }
        }
        // 댓글
        setComments(result.data.comments);
        console.log("댓글:", result.data);
      });
    } catch (err) {
      alert("오류가 발생했습니다. 메인화면으로 돌아갑니다.");
      window.location.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      alert("좋아요 핸들러 오류");
    }
  };

  /** 북마크 핸들러 */
  const scrapeHandler = async () => {
    try {
      await axios.post(`/server/community/post/${postId}/scrape`);
      setHasScraped(!hasScraped);
    } catch (err) {
      alert("스크랩 핸들러 오류");
    }
  };

  /** 팔로우 핸들러 */
  const followHandler = async () => {
    try {
      await axios.post(`/server/community/post/${postId}/follow`);
      setHasFollowed(!hasFollowed);
    } catch (err) {
      alert("팔로우 핸들러 오류");
    }
  };

  /** 포스트 삭제 핸들러 */
  const postDeleteHandler = async () => {
    try {
      //팝업창이 뜨도록 함 취소를 누르면 false이고 확인은 true임
      if (!window.confirm("삭제하시겠습니까?")) {
        return;
      }
      await axios.delete(`/server/community/post/${postId}/delete`);
      navigate("/community"); // 메인화면으로 복귀
    } catch (err) {}
  };

  /** 댓글 생성 핸들러 */
  const commentCreateHandler = async () => {};

  /** 댓글 삭제 핸들러 */
  const commentDeleteHandler = async () => {};

  /** 모든 댓글을 보여줌 */
  const allCommnets = () => {
    // const comments.map((comment)=>{
    // })
  };

  /** 포스트의 모든 이미지를 보여줌 */
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
          <div>
            <button style={{ float: "right" }} onClick={followHandler}>
              {hasFollowed !== null && (hasFollowed ? "팔로잉 취소" : "팔로우")}
            </button>
            <button style={{ float: "right" }} onClick={likeHandler}>
              {hasLiked !== null && (hasLiked ? "좋아요 취소" : "좋아요")}
            </button>
            <button style={{ float: "right" }} onClick={scrapeHandler}>
              {hasScraped !== null && (hasScraped ? "북마크 취소" : "북마크")}
            </button>
          </div>
          <button onClick={commentCreateHandler}>댓글 달기</button>
        </div>
      )}
      {user && post.writer_id === user && (
        <button
          style={{ float: " right", marginLeft: 10 }}
          onClick={postDeleteHandler}
        >
          삭제
        </button>
      )}
      <div>
        <div>댓글</div>
        <div>댓글</div>
      </div>
    </div>
  );
};

export default DetailPost;
