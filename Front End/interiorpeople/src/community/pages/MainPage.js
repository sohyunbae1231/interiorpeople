/** 메인 페이지 */
import React, { useContext } from "react";

/** 컴포넌트 임포트 */
import PostList from "../components/PostList";
import UploadForm from "../components/UploadForm";

const MainPage = () => {
  return (
    <div>
      <h2>사진첩</h2>
      {/* 컴포넌트는 다음과 같이 사용 */}
      {/* me가 존재하는 경우에만(로그인이 되어 있는 경우에만) 업로드 가능 */}
      <PostList />
    </div>
  );
};

export default MainPage;
