/**
 * 함수형 컴포넌트의 상태 관리 : useState
 * axios : 백엔드로 데이터를 보내는 데 사용
 * toast : 실제로 알람을 켜도록 해줌
 */
import React, { useState, useContext, useRef } from "react";
import axios from "axios";

import "./UploadForm.css";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

/** 컴포넌트는 무조건 대문자로 시작해야 함 */
const UploadForm = () => {
  const { setMyImages, setImages } = useContext(ImageContext);
  /**
   * file이란 변수를 선언해주고 그 초깃값을 null로 초기화함
   * 그리고 file의 값을 바꾸기 위해서는 setFile함수를 사용해야 함
   */
  const [files, setFiles] = useState(null);
  // const defaultFileName = "이미지 파일을 업로드해주세요.";
  // const [fileName, setFileName] = useState(defaultFileName);

  /** 이미지 미리보기 여러 장 */
  const [previews, setPreviews] = useState([]);

  /** 이미지가 얼마나 업로드되었는지를 저장하는 변수 */
  const [percent, setPercent] = useState(0);

  // eslint-disable-next-line no-unused-vars
  // const [imgSrc, setImgSrc] = useState(null);

  /** 공개 여부 확인하는 변수 */
  const [isPublic, setIsPublic] = useState(false);

  const inputRef = useRef();

  /** 이미지 핸들러 */
  const imageSelectHandler = async (event) => {
    /** 이미지 파일의 정보를 읽어와서 file변수에 저장 */
    const imageFiles = event.target.files;
    setFiles(imageFiles);

    /** 여러 이미지 미리보기 */
    // 프로미스를 지원하지 않으므로 프로미스를 직접 구현해야 함
    const imagePreviews = await Promise.all(
      // ! 유사배열을 배열로 만들기
      // eslint-disable-next-line array-callback-return
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
              // ! 어렵다!
            };
          } catch (err) {
            reject(err);
          }
        });
      })
    );
    console.log(imagePreviews);
    setPreviews(imagePreviews);
    // const imageFile = imageFiles[0];
    // setFileName(imageFile.name);

    // /** 이미지 미리보기를 위한 파일리더 */
    // const fileReader = new FileReader();
    // fileReader.readAsDataURL(imageFile);
    // /** 파일을 읽음 */
    // fileReader.onload = (e) => {
    //   setImgSrc(e.target.result);
    // };
  };

  /**
   * type이 submit인 button을 누르면 웹 페이지를 새로고침하게 됨
   * 이는 정적 페이지를 다시 불러오게 하고 시간을 소요하게 됨
   * 따라서 새로고침을 못하도록 막기 위한 함수를 만듦
   */
  const onSubmit = async (event) => {
    /** 기본으로 되어 있는 액션을 하자 말라는 의미 */
    event.preventDefault();

    /** 폼 데이터 구조 생성 */
    const formData = new FormData();
    /** 폼 데이터 안에 업로드된 이미지를 value로 하여 key값이 image인 데이터로 저장 */
    for (let file of files) {
      formData.append("image", file); //폼데이터에 각 파일을 append함
    }
    /** 공개 여부 */
    formData.append("public", isPublic);
    /** axios 사용 시 서버로 주고받는 것이므로 오류가 날 수 있기 때문에 예외 처리를 해줌 */
    try {
      /**
       * 두번째 파라미터 : 데이터
       * 세번째 파라미터 : 어떤 데이터가 보내지는지 헤더에 저장(이름 정확히 써주어야 함)
       */
      // eslint-disable-next-line no-unused-vars
      const res = await axios.post("/images", formData, {
        Headers: { "Content-Type": "multipart/form-data" },
        /** onUploadProgress : 업로드되고 있는 현황을 보여줌 */
        onUploadProgress: (ProgressEvent) => {
          /** Math.round : 정수로 반올림 */
          setPercent(
            Math.round((100 * ProgressEvent.loaded) / ProgressEvent.total)
          );
        },
      });
      if (isPublic) {
        setImages((prevData) => [...res.data, ...prevData]);
      }
      setMyImages((prevData) => [...res.data, ...prevData]);

      // 리팩토링
      // if (isPublic) {
      //   setImages([...images, ...res.data]); // ? res.data도 배열이 됨 이미지가 여러 장이니까
      // } else {
      //   setMyImages([...myImages, ...res.data]); // ? res.data도 배열이 됨 이미지가 여러 장이니까
      // }
      inputRef.current.value = null;
      /** 3초 후 percent의 값을 0으로 만듦 */
      setTimeout(() => {
        setPercent(0);
        // setFileName(defaultFileName);
        // setImgSrc(null);
        setPreviews([]);
      }, 3000);
    } catch (err) {
      setPercent(0);
      inputRef.current.value = null;
      // setFileName(defaultFileName);
      // setImgSrc(null);
      setPreviews([]);
      console.error(err);
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
      ? "이미지 파잉을 업로드 해주세요"
      : previews.reduce(
          (previous, current) => previous + `${current.filename},`,
          ""
        );

  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {/* 이미지 미리보기 */}
        {previewImages}
      </div>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      {/* <img
        alt=""
        src={imgSrc}
        // 자바스크립트를 사용할려면 {}를 묶어서 사용해야 함
        className={`image-preview ${imgSrc && "image-preview-show"}`}
      /> */}
      {/* 이미지 업로드 프로그레스 바 */}
      {/* percent의 값을 percent로 해당 컴포넌트에 넘겨줌  */}
      <ProgressBar percent={percent} />

      {/*
        -- htmlFor : 해당 라벨를 눌렀을 때
        htmlFor가 가리키는 id는 가진 input를 누르도록 해줌

        -- 태그 안에 변수를 넣을 때는 {}를 사용해주면 됨
        <label htmlFor="image">{fileName}</label>

        -- onChange : input의 변화가 발생했을 때 해당 인자(예 : 함수)를 실행함 
        <input id = "image" type="file" onChange = {imageSelectHandler}/>
        */}

      <div className="file-dropper">
        {fileName}
        {/* type="file"로 할 경우 모든 파일이 전부 가능.따라서 accept를 사용 */}
        <input
          ref={(ref) => (inputRef.current = ref)}
          id="image"
          type="file"
          multiple={true} // 이미지를 여러 장 올릴 수 있도록 함
          accept="image/*"
          onChange={imageSelectHandler}
        />
      </div>

      {/* 공개 비공개 여부 체크 */}
      <input
        type="checkbox"
        id="public-check"
        value={!isPublic}
        onChange={() => setIsPublic(!isPublic)}
      />
      <label htmlFor="public-check">공개</label>

      {/* css를 사용하지 않고 바로 스타일링 해주는 방법 */}
      {/* %이나 문자열일 경우 따옴표를 이용해야 하지만 px나 그냥 숫자일 경우 따옴표를 써지 않아도 됨 */}
      <button
        type="submit"
        style={{
          width: "100%",
          height: 40,
          borderRadius: "3px",
          cursor: "alias",
        }}
      >
        제출
      </button>
    </form>
  );
};

/** 폼 컴포넌트를 export함 */
export default UploadForm;
