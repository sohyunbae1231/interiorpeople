import React, { useState, useEffect } from 'react';
import axios,{ post } from 'axios';
import { withRouter, BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

// 전부 구현 완료

function Themeupload() {
  
  // 담을 state
  const [file, setFile] = useState("");
  const [imgSrc, setImgSrc] = useState("");
 
  // onChange역할
  const handleFileChange = (event) => {
    const imageFile = event.target.files[0];
    setFile(imageFile);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile)
    fileReader.onload = e => setImgSrc(e.target.result);
  };
 
  // formData라는 instance에 담아 보냄
  const onSubmit = () => {
    const formData = new FormData();
 
    formData.append("userfile", file, file.name);
 
    axios.post("/upload", formData)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <div class="explanation-group" style={{marginTop: "20px"}}>
        <div class="small-black-text">원하는 테마 이미지를 업로드해주세요<br/>(이미지가 없을 시 다음으로 넘어가주세요)</div>
        <input type="file" onChange={handleFileChange} accept="image/*" style={{ marginLeft:"5%", marginTop:"30px" }} />
        <img src={imgSrc} className={`image-preview ${imgSrc && "image-preview-show"}`}/>
      </div>
      <button type="submit" style={{ background: "#203864", color: "white", marginLeft:"5%", marginTop:"30px", width:"90%", height: "45px", borderRadius: "10px"}}>업로드</button>
      <button style={{ background: "#203864", color: "white", marginLeft:"5%", marginTop:"20px", width:"90%", height: "45px", borderRadius: "10px"}}><Link to="/interior/result">결과 보기</Link></button>
    </form>
  );
};
 
export default Themeupload;