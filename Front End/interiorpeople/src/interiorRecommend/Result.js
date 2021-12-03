import React, { useState, useEffect } from "react";
import axios from "axios";

function Result() {
  const [pocessedImageUrl, setProcessedImageUrl] = useState();

  useEffect(() => {
    try {
      const imageId = sessionStorage.getItem("imageId");
      // 변환된 이미지 불러오기
      axios
        .post("/api/image/local-style-transfer", { imageId: imageId })
        .then((result) => {
          setProcessedImageUrl(result.data.processedImage);
        });
    } catch (err) {
      alert("에러가 발생했습니다. 메인으로 돌아갑니다.");
      window.location.replace("/");
    }
  }, []);

  // 이미지 보이기
  return (
    <div>
      <h2>결과</h2>
      <img
        alt=""
        src={`/uploads/${pocessedImageUrl}`}
        style={{ width: 200, height: 200, objectFit: "cover" }}
      ></img>
    </div>
  );
}

export default Result;
