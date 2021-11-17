import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { withRouter, BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
//비로그인 상태면 로그인 버튼만 보이고, 로그인 상태면 로그아웃 버튼만 보이게 하기

  function Nav() {
    useEffect(() => {
      axios.get('/api/hello')
      .then(response => {console.log(response)})
    }, [])
    const onClickHandler = () => {
      axios.get('/api/users/logout')
      .then(response => {
        console.log(response.data)
      })
    }

    return (
      <div>
        <div class="home">
          <img src={require("./img/logo.jpg").default} style={{width:"50%", marginLeft:'15%'}}/>
        </div>
        <button style={{marginLeft:'75%'}}>
          <Link to="/login">로그인</Link>
        </button>
        <button onClick={onClickHandler}>
          로그아웃 
        </button>
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