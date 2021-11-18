import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  withRouter,
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
} from "react-router-dom";

import { AuthContext } from "./context/AuthContext";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  // 현재 유저가 어떤 유저인지 판별
  // TODO : 필요한가?
  const [user, setUser] = useContext(AuthContext);

  const handleInputId = (e) => {
    setId(e.target.value);
  };

  const handleInputPw = (e) => {
    setPassword(e.target.value);
  };

  const OnClickLogin = async (e) => {
    e.preventDefault();

    await axios
      .post("/account/login", {
        id: "abc123",
        password: "abc123",
      })
      .then()
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div class="login">
      <h2>로그인</h2>
      <form onSubmit={loginHandler}>
        <div class="id">
          <input
            type="text"
            name="input_id"
            value={id}
            setValue={setId}
            onChange={handleInputId}
            placeholder="아이디"
          />
        </div>
        <div class="pw">
          <input
            type="password"
            name="input_pw"
            value={password}
            setValue={setPassword}
            onChange={handleInputPw}
            placeholder="비밀번호"
          />
        </div>
        <div class="submit">
          <button type="submit">로그인</button>
        </div>
      </form>
      <div class="login_etc">
        <Link to="/login">아이디/비밀번호 찾기</Link>
        <Link to="/signup">회원가입</Link>
      </div>
      <div class="sns_etc">SNS계정으로 간편 로그인/회원가입</div>
      <div class="login_sns">
        <li>
          <a href="">
            <img src="img/facebook.png" width="67px" />
            <i class="fab fa-facebook-f"></i>
          </a>
        </li>
        <li>
          <a href="">
            <img src="img/kakao.png" width="63px" />
            <i class="fab fa-facebook-f"></i>
          </a>
        </li>
        <li>
          <a href="">
            <img src="img/naver.png" width="61px" />
            <i class="fab fa-twitter"></i>
          </a>
        </li>
      </div>
    </div>
  );
}

export default Login;
