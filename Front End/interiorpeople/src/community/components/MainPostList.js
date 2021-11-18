import React, { useContext, useEffect, useRef, useCallback } from "react";
import { ImageContext } from "../context/ImageContext";
import { Link } from "react-router-dom";

import "./MainPostList.css";

/** 이미지 리스트의 정보를 서버에서 받아와 출력 */
const MainPostList = () => {
  /** ImageContext의 정보에 접근 */
  const {
    images,
    isPublic,
    setIsPublic,
    imageLoading,
    imageError,
    setImageUrl,
  } = useContext(ImageContext);
  const [me] = useContext(AuthContext);

  const elementRef = useRef(null); // 무한 스크롤 적용에 필요

  // ? 리렌더링 될 때마다 함수가 새로 만들어짐 -> useCallback 사용
  const loaderMoreImages = useCallback(() => {
    if (imageLoading || images.length === 0) {
      console.log(
        "imageLoading : ",
        imageLoading,
        "images.length : ",
        images.length
      );
      return;
    }
    const lastImageId = images[images.length - 1]._id;
    setImageUrl(`${isPublic ? "" : "/users/me"}/images?lastid=${lastImageId}`);
    console.log(`${isPublic ? "" : "/users/me"}/images?lastid=${lastImageId}`);
  }, [images, imageLoading, isPublic, setImageUrl]);

  //무한 스크롤 해당 엘리먼트 추적
  useEffect(() => {
    if (!elementRef.current) {
      return;
    }
    // console.log(elementRef);
    const observer = new IntersectionObserver(([entry]) => {
      // console.log(entry);
      // entry.isIntersecting(); // 화면에 들어오는 순간 true로 바뀜
      if (entry.isIntersecting) {
        loaderMoreImages();
      }
    });
    observer.observe(elementRef.current);
    return () => {
      observer.disconnect();
    };
  }, [loaderMoreImages]);

  /** 받아온 키를 이용하여 사진 호출 */
  // ? (isPublic ? images : myImages).map() 이렇게 사용 가능 <- 중복된 코드이므로 삭제
  const imgList = images.map((image, index) => (
    // eslint-disable-next-line jsx-a11y/alt-text
    /** 리액트에선 key라는 게 필요한 데 그 이유는 오류나 바꿔야할 것이 있으면 */
    /** 키를 이용하여 빠르게 바꾸기 위해서이다 */
    <Link
      key={image.key}
      to={`/images/${image._id}`}
      ref={index + 1 === images.length ? elementRef : undefined} // 무한 스크롤의 기준
    >
      <img alt="" src={`http://localhost:5000/uploads/${image.key}`} />
    </Link>
  ));

  return (
    <div>
      <h3 style={{ display: "inline-block", marginRight: 10 }}>
        Image List({isPublic ? "공개" : "개인"} 사진)
      </h3>
      {me && (
        <button
          onClick={() => {
            setIsPublic(!isPublic);
            console.log(isPublic);
          }}
        >
          {(isPublic ? "개인" : "공개") + "사진 보기"}
        </button>
      )}
      <div className="image-list-container">{imgList}</div>
      {imageError && <div>Error...</div>}
      {imageLoading && <div>loading...</div>}
      {/* {imageLoading ? (
        <div>loading...</div>
      ) : (
        <button onClick={loaderMoreImages}>load more images</button>
      )} */}
    </div>
  );
};

export default MainPostList;
