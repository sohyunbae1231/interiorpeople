/** 메인 페이지 */
import React from "react";
import { Link } from "react-router-dom";

/** 컴포넌트 임포트 */
// import PostList from "../components/PostList";
// import UploadForm from "../components/UploadForm";

const MainPage = () => {
  return (
    <div>
      <Link to="mypost/write">
        <button style={{ width: "100%", height: 30 }}>글쓰기</button>
      </Link>
      <Link to="mypost">
        <button style={{ width: "100%", height: 30 }}>나의글</button>
      </Link>

      <Link to="postlist">
        <button style={{ width: "100%", height: 30 }}>포스트리스트</button>
      </Link>
    </div>
  );
};

export default MainPage;
