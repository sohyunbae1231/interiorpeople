import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";

import { AuthContext } from "../context/AuthContext";
import { ImageContext } from "../context/ImageContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ImagePage = () => {
  const navigate = useNavigate();
  // 노드js처럼 url의 매개변수를 가져옴
  const { imageId } = useParams();
  const { images, setImages, setMyImages } = useContext(ImageContext);

  const [me] = useContext(AuthContext);
  const [hasLiked, setHasLiked] = useState(false);
  const [error, setError] = useState(false);
  const [image, setImage] = useState();
  // 여기서는 _id가 String임
  useEffect(() => {
    const img = images.find((image) => image._id === imageId);
    if (img) {
      setImage(img);
    }
  }, [images, imageId]);

  useEffect(() => {
    if (image && image._id === imageId) {
      return;
    } // 배열의 이미지가 존재할 때
    else {
      // 배열에 이미지가 존재하지 않으면 무조건 서버 호출한다.
      axios
        .get(`/images/${imageId}`)
        .then(({ data }) => {
          setImage(data);
          setError(false);
        })
        .catch((err) => {
          setError(true);
          toast.error(err.response.data.message);
        });
    }
  }, [imageId]);

  useEffect(() => {
    console.log("me의 값 : ", me);
    console.log(image);
    if (me && image && image.likes.includes(me.name)) {
      setHasLiked(true);
      console.log("hello");
    }
  }, [me, image]);
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
      ...images.filter((image) => image._id !== imageId),
      currentImage,
    ].sort(
      // ? 생성일 순으로 정렬
      (a, b) =>
        // ? a.createAt 는 Number가 아니라서(String) getTime을 이용해 Number 타입으로 변환
        // new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        {
          if (b._id > a._id) {
            return 1;
          } else {
            return -1;
          }
        }
    );
  const onSubmit = async () => {
    const result = await axios.patch(
      // http://localhost:5000
      `/images/${imageId}/${hasLiked ? "unlike" : "like"}`
    );
    // 이미지 좋아요 반영
    if (result.data.public) {
      // 공개 이미지
      setImages((prevData) => updateImage(prevData, result.data));
    }
    // 비공개 이미지
    setMyImages((prevData) => updateImage(prevData, result.data));

    setHasLiked(!hasLiked);
  };

  const deleteHandler = async () => {
    try {
      //팝업창이 뜨도록 함 취소를 누르면 false이고 확인은 true임
      if (!window.confirm("삭제하시겠습니까?")) {
        return;
      }
      // console.log("delete");
      const result = await axios.delete(`/images/${imageId}`);
      toast.success(result.data.message);
      setImages((prevData) =>
        prevData.filter((image) => image._id !== imageId)
      );
      setMyImages((prevData) =>
        prevData.filter((image) => image._id !== imageId)
      );
      navigate.push("/"); // 메인화면으로 복귀
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h3>Image Page</h3>
      <img
        style={{ width: "100%" }}
        alt={imageId}
        src={`http://localhost:5000/uploads/${image.key}`}
      />
      <span>좋아요 {image.likes.length}</span>
      <button style={{ float: "right" }} onClick={onSubmit}>
        {hasLiked ? "좋아요 취소" : "좋아요"}
      </button>
      {me && image.user.name === me.name && (
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

export default ImagePage;
