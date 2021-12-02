import React, { useState } from "react";
import axios from "axios";
import {} from "react-router-dom";
import { useNavigate } from "react-router-dom";

// 전부 구현 완료

function Themeupload() {
  // 담을 state
  const [file, setFile] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const navigate = useNavigate();

  // onChange역할
  const handleFileChange = (event) => {
    const imageFile = event.target.files[0];
    setFile(imageFile);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile);
    fileReader.onload = (e) => setImgSrc(e.target.result);
  };

  // formData라는 instance에 담아 보냄
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("theme", file, file.name);
    try {
      await axios
        .post("/api/image/upload-theme", formData, {
          Headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          navigate("/interior/selectstyle");
        });
    } catch (err) {
      alert(err);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div class="explanation-group" style={{ marginTop: "20px" }}>
        <div class="small-black-text">
          원하는 테마 이미지를 업로드해주세요
          <br />
          (이미지가 없을 시 다음으로 넘어가주세요)
        </div>

        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img
          src={imgSrc}
          className={`image-preview ${imgSrc && "image-preview-show"}`}
        />
      </div>
      <input
        id="input-file"
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />
      <label
        className="input-file-button"
        for="input-file"
        style={{
          background: "#203864",
          color: "white",
          // alignItems: "center",
          marginLeft: "5%",
          marginTop: "30px",
          // width: "90%",
          height: "45px",
          borderRadius: "10px",
        }}
      >
        테마 이미지 업로드
      </label>
      <button
        type="submit"
        className="input-file-button"
        style={{
          background: "#203864",
          color: "white",
          marginLeft: "5%",
          marginTop: "20px",
          width: "90%",
          height: "45px",
          borderRadius: "10px",
        }}
      >
        결과 보기
      </button>
    </form>
  );
}

export default Themeupload;
