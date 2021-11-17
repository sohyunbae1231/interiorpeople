import React, { useState, useEffect } from "react";
import axios from "axios";

function Signup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const handleInputId = (e) => {
    setId(e.target.value);
  };

  const handleInputPw = (e) => {
    setPassword(e.target.value);
  };

  const handleInputPwCheck = (e) => {
    setPasswordCheck(e.target.value);
  };

  const OnClickSignup = async (e) => {
    e.preventDefault();

    // TODO: 아이디가 한글이라던가

    // TODO: 비밀번호 비밀번호가 너무 긴 경우 또는 짧은
    if (password.length < 8) {
      alert("8자의 이상의 비밀번호를 사용해야 합니다.");
    }
    // 비밀번호랑 비밀번호 확인이 다를 경우
    if (password !== passwordCheck) {
      return alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
    }

    console.log("click login");

    await axios
      .post("/account/register", { id, password })
      .then((res) => console.log(res))
      .catch();
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={OnClickSignup}>
        <div>
          <input
            type="text"
            name="input_id"
            value={id}
            setValue={setId}
            onChange={handleInputId}
            placeholder="아이디"
          />
        </div>
        <div>
          <input
            type="password"
            name="input_pw"
            value={password}
            setValue={setPassword}
            onChange={handleInputPw}
            placeholder="비밀번호"
          />
        </div>
        <div>
          <input
            type="password"
            name="input_pw_check"
            value={passwordCheck}
            setValue={setPasswordCheck}
            onChange={handleInputPwCheck}
            placeholder="비밀번호 확인"
          />
        </div>
        <div>
          <button type="submit">회원가입하기</button>
        </div>
      </form>
      <div>
        <h4>SNS계정으로 간편 회원가입</h4>
        <a href="signup.html">
          <img src="img/facebook.png" width="48" height="48"></img>
        </a>
        <a href="signup.html">
          <img src="img/kakao.png" width="48" height="48"></img>
        </a>
        <a href="signup.html">
          <img src="img/naver.png" width="48" height="48"></img>
        </a>
      </div>
    </div>
  );
}

export default Signup;
