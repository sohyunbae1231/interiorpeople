import React from "react";
import { Link } from 'react-router-dom';
//import "./Nav.css";
const Nav = () => {
    return (
      <div>
        <ul>
          <li><Link to="/">홈</Link></li>
          <li><Link to="/mypage">마이페이지</Link></li>
          <li><Link to="/interior/upload">인테리어 추천</Link></li>
          <li><Link to="/community">커뮤니티</Link></li>
          <li><Link to="/support">고객센터</Link></li>
        </ul>
        <hr/>
      </div>
    );
};

export default Nav;