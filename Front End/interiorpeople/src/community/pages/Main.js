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
        <button>글쓰기</button>
      </Link>
      <Link to="mypost">
        <button>나의글</button>
      </Link>

      <Link to="postlist">
        <button>포스트리스트</button>
      </Link>
    </div>
  );
};

export default MainPage;
