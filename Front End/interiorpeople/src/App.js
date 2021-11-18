import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./Nav";
// 홈
import Home from "./Home";
// 로그인, 회원가입, 비밀번호찾기
import Login from "./Login";
import Signup from "./Signup";
import Forget from "./Forget";
// 고객센터
import Support from "./Support";
// 마이페이지 메인, 프로필 편집, 나의 사진, 스크랩, 추천 기록
import Mypage from "./Mypage";
import Profile from "./Profile";
import Myphoto from "./Myphoto";
import Scrap from "./Scrap";
import History from "./History";
// 인테리어 추천 - 사진 업로드, 영역 선택, 스타일 선택, 스타일 편집, 원하는 사진 추가 업로드, 분석 완료
import Upload from "./Upload";
import Selectarea from "./Selectarea";
import Selectstyle from "./Selectstyle";
//import Editstyle from "./Editstyle"; // 팝업으로 구현하기
import Themeupload from "./Themeupload";
import Result from "./Result";

// 커뮤니티 메인, 나의 글 상세, 포스트 상세화면, 글 작성
import CommunityPage from "./community/pages/CommunityPage";
import CommunityMain from "./community/pages/Main";
import CommunityDetailPost from "./community/pages/DetailPost";
import CommunityMyPost from "./community/pages/MyPost";
import CommunityPostList from "./community/pages/PostList";
import CommunityWritePost from "./community/pages/WritePost";

import Mypost from "./Mypost";
import Postlist from "./Postlist";
import Postwrite from "./Postwrite";

// import Like from "./Like";

//import MenuList from './MenuList';

function App() {
  return (
    <div className="app">
      <Router>
        <Nav />
        <Routes>
          {/* <Route path="/like" element={<Like />} /> */}

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget" element={<Forget />} />

          <Route path="/support" element={<Support />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/mypage/profile" element={<Profile />} />
          <Route path="/mypage/myphoto" element={<Myphoto />} />
          <Route path="/mypage/scrap" element={<Scrap />} />
          <Route path="/mypage/history" element={<History />} />

          <Route path="/interior/upload" element={<Upload />} />
          <Route path="/interior/selectarea" element={<Selectarea />} />
          <Route path="/interior/selectstyle" element={<Selectstyle />} />
          <Route path="/interior/themeupload" element={<Themeupload />} />
          <Route path="/interior/result" element={<Result />} />

          {/* 커뮤니티 관련 */}
          <Route path="/community/*" element={<CommunityPage />}>
            <Route path="" element={<CommunityMain />} />
            <Route path="mypost" element={<CommunityMyPost />} />
            <Route path="post/:postId" element={<CommunityDetailPost />} />
            <Route path="postlist" element={<CommunityPostList />} />
            <Route path="mypost/write" element={<CommunityWritePost />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
