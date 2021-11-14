import React, { useState, useEffect } from "react";
import axios from "axios";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleInputId = (e) => {
    setId(e.target.value);
  };

  const handleInputPw = (e) => {
    setPassword(e.target.value);
  };

  const OnClickLogin = async (e) => {
    e.preventDefault();

    console.log("click login");

    await axios
      .post("/account/register", { id, password })
      .then((res) => console.log(res))
      .catch();
  };

  return (
    <div class="login">
      <h2>로그인</h2>
      <form onSubmit={OnClickLogin}>
        <div class="login_id">
          <input
            type="text"
            name="input_id"
            value={id}
            setValue={setId}
            onChange={handleInputId}
            placeholder="아이디"
          />
        </div>
        <div class="login_pw">
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
        <li>
          <a href="home.html">아이디/비밀번호 찾기</a>
        </li>
        <li>
          <a href="signup.html">회원가입</a>
        </li>
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
