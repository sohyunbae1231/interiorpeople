/** 마이 페이지 메인 */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../fonts/MyPageMain.css";

// <ul></ul> 부분 고치기!! -> 깨져서 나옴

const MyPageMain = () => {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [userProfilePhoto, setUserProfilePhoto] = useState(null);

  useEffect(() => {
    try {
      axios.get(`/api/mypage`).then((result) => {
        setUserName(result.data.name);
        setUserId(result.data.id);
        setUserProfilePhoto(result.data.s3_profilephoto_img_url);
      });
    } catch (err) {
      alert("오류가 발생했습니다.");
    }
  });

  return (
    <div>
      {userProfilePhoto ? (
        <img
          alt=""
          src={require("../../img/profile.png").default}
          style={{
            height: "90px",
            left: "0",
            marginLeft: "20%",
            marginTop: "30px",
            float: "left",
          }}
        />
      ) : (
        // 나의 프로필 사진 불러오기
        <img
          alt=""
          src={require("../../img/profile.png").default}
          style={{
            height: "90px",
            left: "0",
            marginLeft: "20%",
            marginTop: "30px",
            float: "left",
          }}
        />
      )}

      <div
        class="explanation-group"
        style={{ marginTop: "40px", display: "inline-block" }}
      >
        <div style={{ marginLeft: "35%" }}>{userName}</div>
        <div style={{ marginLeft: "35%" }}>{userId}</div>
        <button
          class="mypage-button-font"
          style={{
            background: "#203864",
            color: "white",
            marginLeft: "35%",
            marginTop: "10px",
            width: "120%",
            borderRadius: "5px",
          }}
        >
          <Link to="/mypage/profile">프로필 편집</Link>
        </button>
      </div>
      <ul style={{ width: "90%", margin: "10px auto", marginTop: "60px" }}>
        <li style={{ float: "left", width: "30%" }}>
          <Link to="/mypage/myphoto">
            <img
              alt=""
              src={require("../../img/gallery.png").default}
              style={{ width: "50%", display: "block" }}
            />
            나의 사진
          </Link>
        </li>
        <li style={{ float: "left", width: "30%" }}>
          <Link to="/mypage/bookmark">
            <img
              alt=""
              src={require("../../img/bookmark.png").default}
              style={{ width: "68%", display: "block" }}
            />
            북마크
          </Link>
        </li>
        <li style={{ float: "left", width: "30%" }}>
          <Link to="/mypage/history">
            <img
              alt=""
              src={require("../../img/records.png").default}
              style={{ width: "50%", display: "block" }}
            />
            추천 기록
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MyPageMain;
