import React, { useRef, useState } from "react";
import axios from "axios";

/** 유저 인증 관련 컨텍스트 */
// import { AuthContext } from "../../context/AuthContext";

// import SimpleSlider from "../components/ImageCarousel";

import "./WritePost.css";

const WritePost = () => {
  // const { setMyImages, setImages } = useContext(ImageContext);

  const [files, setFiles] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [title, setTitle] = useState("제목없음");
  const [content, setContent] = useState("내용없음");

  const inputRef = useRef();

  const imageSelectHandler = async (event) => {
    /** 이미지 파일의 정보를 읽어와서 file변수에 저장 */
    const imageFiles = event.target.files;
    setFiles(imageFiles);

    // 프로미스를 지원하지 않으므로 프로미스를 직접 구현해야 함
    const imagePreviews = await Promise.all(
      [...imageFiles].map(async (imageFile) => {
        return new Promise((resolve, reject) => {
          try {
            /** 이미지 미리보기를 위한 파일리더 */
            const fileReader = new FileReader();
            fileReader.readAsDataURL(imageFile); // 비동기적으로 처리됨
            /** 파일을 읽음 */
            fileReader.onload = (e) => {
              resolve({ imgSrc: e.target.result, filename: imageFile.name }); // resolve를 통해 이미지 url이 반환됨
              // 프로미스를 리턴하는데 url을 반환함
            };
          } catch (err) {
            reject(err);
          }
        });
      })
    );
    setPreviews(imagePreviews);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    /** 폼 데이터 구조 생성 */
    const formData = new FormData();
    /** 폼 데이터 안에 업로드된 이미지를 value로 하여 key값이 image인 데이터로 저장 */
    for (let file of files) {
      formData.append("images", file); // 폼데이터에 각 파일을 append함
    }
    formData.append("title", title);
    formData.append("content", content);
    try {
      await axios.post("/community/mypost/write", formData, {
        Headers: { "Content-Type": "multipart/form-data" },
      });

      inputRef.current.value = null;
      setTimeout(() => {
        setPreviews([]);
      }, 0);
      alert("포스트가 작성되었습니다.");
    } catch (err) {
      inputRef.current.value = null;
      setPreviews([]);
      console.error(err);
      alert(err);
    }
  };

  const previewImages = previews.map((preview, index) => (
    <img
      key={index}
      src={preview.imgSrc}
      style={{ width: 200, height: 200, objectFit: "cover" }}
      alt=""
      className={`image-preview ${preview.imgSrc && "image-preview-show"}`}
    />
  ));

  // 이미지 이름을 하나의 스트링으로 합쳐 나열함
  const fileName =
    previews.length === 0
      ? "이미지 파일을 업로드 해주세요"
      : previews.reduce(
          (previous, current) => previous + `${current.filename},`,
          ""
        );

  return (
    <div>
      {/* <SimpleSlider /> */}
      <form onSubmit={onSubmit}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {/* 이미지 미리보기 */}
          {previewImages}
        </div>

        <div className="file-dropper">
          {fileName}
          {/* type="file"로 할 경우 모든 파일이 전부 가능. 따라서 accept를 사용 */}
          <input
            ref={(ref) => (inputRef.current = ref)}
            id="image"
            type="file"
            multiple={true} // 이미지를 여러 장 올릴 수 있도록 함
            accept="image/*" // 오직 이미지만
            onChange={imageSelectHandler}
          />
        </div>
        <div>
          <label>제목</label>
          <input
            style={{ width: "100%" }}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div>
          <label>내용</label>
          <input
            style={{ width: "100%" }}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            height: 40,
            borderRadius: "3px",
            cursor: "alias",
          }}
        >
          포스트 작성
        </button>
      </form>
    </div>
  );
};

export default WritePost;
