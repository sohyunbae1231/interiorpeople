import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const DetailPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();

  const [user] = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [error, setError] = useState(false);
  const [post, setPost] = useState();
  const [postUrl, setPostUrl] = useState("/server/community/post");
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState(false);
  const pastPostUrlRef = useRef();

  // useEffect(() => {
  //   if (pastPostUrlRef.current === postUrl) {
  //     return;
  //   }
  //   setPostLoading(true);
  //   axios
  //     .get(postUrl)
  //     .then((result) => {
  //       setPosts((prevData) => [...prevData, ...result.data]);
  //     })
  //     .catch((err) => {
  //       setPostError(err);
  //     })
  //     .finally(() => {
  //       setPostLoading(false);
  //       pastPostUrlRef.current = postUrl;
  //     });
  // }, [postUrl]);

  useEffect(() => {
    const img = posts.find((post) => post._id === postId);
    if (img) {
      setPost(img);
    }
  }, [posts, postId]);

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

  // useEffect(() => {
  //   if (user && post && post.likes.includes(user.name)) {
  //     setHasLiked(true);
  //   }
  // }, [user, post]);

  if (error) {
    return <h3>Error...</h3>;
  } else if (!post) {
    return <h3>Loading...</h3>;
  }

  const updateImage = (images, currentImage) =>
    [
      // 기존 이미지는 제외
      ...images.filter((image) => image._id !== postId),
      currentImage,
    ].sort(
      // ? 생성일 순으로 정렬
      (a, b) =>
        // ? a.createAt 는 Number가 아니라서(String) getTime을 이용해 Number 타입으로 변환
        {
          if (b._id > a._id) {
            return 1;
          } else {
            return -1;
          }
        }
    );
  // TODO : 자신의 포스트는 좋아요 불가
  const likeHandler = async () => {
    await axios.post(`community/post/${postId}/like`);
    setHasLiked(!hasLiked);
  };

  const deleteHandler = async () => {
    // try {
    //   //팝업창이 뜨도록 함 취소를 누르면 false이고 확인은 true임
    //   if (!window.confirm("삭제하시겠습니까?")) {
    //     return;
    //   }
    //   // console.log("delete");
    //   const result = await axios.delete(`/images/${postId}`);
    //   setImages((prevData) => prevData.filter((image) => image._id !== postId));
    //   setMyImages((prevData) =>
    //     prevData.filter((image) => image._id !== postId)
    //   );
    //   navigate.push("/community"); // 메인화면으로 복귀
    // } catch (err) {}
  };

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
      {/* <span>좋아요 {post.likes.length}</span>
      <button style={{ float: "right" }} onClick={likeHandler}>
        {hasLiked ? "좋아요 취소" : "좋아요"}
      </button> */}
      {/* {user && post.user.name === user.name && (
        <button
          style={{ float: " right", marginLeft: 10 }}
          onClick={deleteHandler}
        >
          삭제
        </button>
      )} */}
    </div>
  );
};

export default DetailPost;
