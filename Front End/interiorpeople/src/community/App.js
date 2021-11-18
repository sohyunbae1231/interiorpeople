/** React 임포트 */
import React from "react";

/** 페이지 임포트 */
import MainPage from "./pages/MainPage";
import PostPage from "./pages/PostPage";
import MyPostPage from "./pages/MyPostPage";
import WritePost from "./pages/WritePost";

import { Routes, Route } from "react-router-dom";

const App = () => {
  /** 리턴할 때 항상 최상위 하나의 태그만 리턴 가능 */
  return (
    /** 너비의 최대 길이를 한정하고 여백을 알아서 주도록 함(가운데 정렬) */
    <div style={{ maxWidth: 600, margin: "auto" }}>
      {/* 실제 alert가 나오는 react-toastify 컴포넌트 */}
      {/* 각 페이지를 연결해줌 */}
      hello
      <Routes>
        {/* exact를 넣는 이유는 해당 URL에만 적용하기 위함임 */}
        {/* 순서도 중요! */}
        <Route path="/images/:imageId" exact component={MainPage} />
        {/* <Route path="/auth/login" exact component={LoginPage} /> */}
        {/* <Route path="/auth/register" exact component={RegisterPage} /> */}
        <Route path="/" component={MainPage} />
      </Routes>
    </div>
  );
};

export default App;
