import React, { useState, useEffect } from "react";
import axios from "axios";
import PuffLoader from "react-spinners/PuffLoader";
import styled from "styled-components";

const Flex = styled.div`
  margin-top: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

function Result() {
  const [originalImageUrl, setOriginalImageUrl] = useState();
  const [pocessedImageUrl, setProcessedImageUrl] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const imageId = sessionStorage.getItem("imageId");
      // 변환된 이미지 불러오기
      axios
        .post("/api/image/local-style-transfer", { imageId: imageId })
        .then((result) => {
          console.log(result);
          setProcessedImageUrl(result.data.transferedImage);
          setOriginalImageUrl(result.data.originalImage);
        });
    } catch (err) {
      alert("에러가 발생했습니다. 메인으로 돌아갑니다.");
      window.location.replace("/");
    }
    setTimeout(() => setLoading(false), 4000);
  }, []);

  // 이미지 보이기
  return (
    <div>
      {loading ? (
        <div>
          <Flex>
            <h2>이미지를 변환하고 있습니다...</h2>
            <br />
            <PuffLoader size="300" color="black" radius="8" />
          </Flex>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h2 style={{ alignContent: "center", width: "90%" }}>변환 결과</h2>
          <h3>원본 사진</h3>
          <img
            alt=""
            src={`/uploads/${originalImageUrl}`}
            style={{ width: 200, height: 200, objectFit: "cover" }}
          ></img>
          <br />
          <h3>변환된 사진</h3>
          <img
            alt=""
            src={`/uploads/${pocessedImageUrl}`}
            style={{ width: 200, height: 200, objectFit: "cover" }}
          ></img>
        </div>
      )}
    </div>
  );
}

export default Result;
