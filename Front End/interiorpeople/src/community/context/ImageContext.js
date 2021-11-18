import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();

/** 이렇게 함으로써 ImageContext의 내용을 중앙에서 관리할 수 있다 */
export const ImageProvider = (prop) => {
  /** 모든 이미지를 불러옴 */
  const [images, setImages] = useState([]);

  // 개인 사진들
  const [myImages, setMyImages] = useState([]);

  const [isPublic, setIsPublic] = useState(false);

  const [imageUrl, setImageUrl] = useState("/images");

  const [imageLoading, setImageLoading] = useState(false);

  const [imageError, setImageError] = useState(false);

  const pastImageUrlRef = useRef();
  //ImageContext에서 AuthContext를 불러올 수 있는 이유는 AuthContext가 ImageContext를 감싸고 있기 때문임
  const [me] = useContext(AuthContext);
  useEffect(() => {
    if (pastImageUrlRef.current === imageUrl) {
      return;
    }
    setImageLoading(true);
    axios
      .get(imageUrl)
      .then((result) => {
        isPublic
          ? setImages((prevData) => [...prevData, ...result.data])
          : setMyImages((prevData) => [...prevData, ...result.data]);
      })
      .catch((err) => {
        console.error(err);
        setImageError(err);
      })
      .finally(() => {
        console.log(isPublic);
        setImageLoading(false);
        pastImageUrlRef.current = imageUrl;
      });
  }, [imageUrl, isPublic]);
  useEffect(() => {
    // 유저의 개인 사진만 불러옴 //me가 존재할 경우만
    if (me) {
      // ! 자바스크립트 이벤트 루프 중요 !
      setTimeout(() => {
        axios
          .get("/users/me/images")
          .then((result) => {
            setMyImages(result.data);
          })
          .catch((err) => console.error(err));
      }, 0);
    } else {
      setMyImages([]);
      setIsPublic(true);
    }
  }, [me]); //me의 값이 변경될 때만 실행된다

  /** value를 통해 하위 자식 컴포넌트에게 정보를 넘겨 줄 수 있다 */
  return (
    // 배열보다는 객체로 넘겨주는 게 훨씬 편할 수 있음
    <ImageContext.Provider
      value={{
        images: isPublic ? images : myImages, // 리팩토링
        setImages,
        setMyImages,
        isPublic,
        setIsPublic,
        setImageUrl,
        imageLoading,
        imageError,
      }}
    >
      {prop.children}
    </ImageContext.Provider>
  );
};
