import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Upload.css";

function Upload() {
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

    formData.append("image", file, file.name);
    try {
      await axios
        .post("/api/image/segmetantion", formData, {
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
          인테리어 분석을 하고 싶은 방 사진을 등록해주세요
        </div>

        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img
          src={imgSrc}
          className={`image-preview ${imgSrc && "image-preview-show"}`}
          style={{ border: "0", outline: "0", marginTop: "30px" }}
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
        이미지 업로드
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
        다음으로
      </button>
    </form>
  );
}

export default Upload;
