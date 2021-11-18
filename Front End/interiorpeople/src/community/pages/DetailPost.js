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
  const [image, setImage] = useState();
  const [postUrl, setPostUrl] = useState("/server/community/post");
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState(false);
  const pastPostUrlRef = useRef();

  useEffect(() => {
    if (pastPostUrlRef.current === postUrl) {
      return;
    }
    setPostLoading(true);
    axios
      .get(postUrl)
      .then((result) => {
        setPosts((prevData) => [...prevData, ...result.data]);
      })
      .catch((err) => {
        setPostError(err);
      })
      .finally(() => {
        setPostLoading(false);
        pastPostUrlRef.current = postUrl;
      });
  }, [postUrl]);

  useEffect(() => {
    const img = posts.find((post) => post._id === postId);
    if (img) {
      setImage(img);
    }
  }, [posts, postId]);

  useEffect(() => {
    if (image && image._id === postId) {
      return;
    } // 배열의 이미지가 존재할 때
    else {
      // 배열에 이미지가 존재하지 않으면 무조건 서버 호출한다.
      axios
        .get(`/images/${postId}`)
        .then(({ data }) => {
          setImage(data);
          setError(false);
        })
        .catch((err) => {
          setError(true);
        });
    }
  }, [image, postId]);

  useEffect(() => {
    console.log("me의 값 : ", user);
    console.log(image);
    if (user && image && image.likes.includes(user.name)) {
      setHasLiked(true);
      console.log("hello");
    }
  }, [user, image]);
  // ? images, myImages 의 값이 바뀔 때 컴포넌트가 리렌더링 되면서 코드를 다시 실행함
  // ? 따라서 이미지를 불러오지 못헀을 때는 아래 if문이 되고 이미지를 불러왔다면
  // ? 이미지를 보여줌
  if (error) {
    return <h3>Error...</h3>;
  } else if (!image) {
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

  const allImagesInPost = () => {
    for (let postImageUrl of postId.s3_photo_img_url) {
      <img
        style={{ width: "100%" }}
        alt={postId}
        src={`/uploads/${postImageUrl}`}
      />;
    }
  };

  return (
    <div>
      <h3>Image </h3>
      {allImagesInPost}

      <span>좋아요 {image.likes.length}</span>
      <button style={{ float: "right" }} onClick={likeHandler}>
        {hasLiked ? "좋아요 취소" : "좋아요"}
      </button>
      {user && image.user.name === user.name && (
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
