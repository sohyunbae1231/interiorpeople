import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

// 회원 이름 추가/변경(완료?), 프로필 사진 추가/변경(미완료), 비밀번호 변경(완료)

function Profile() {    
    // 닉네임 변경
    const [inputs, setInputs] = useState({
      nickname: "",
    });
    const nameInput = useRef();	// useRef()를 사용해서 Ref 객체 생성
  
    const { nickname } = inputs;
  
    const onChange = (e) => {
      const { value, name } = e.target;
      setInputs({
        ...inputs,
        [name]: value,
      });
    };
  
    const onReset = () => {
      setInputs({
        nickname: "",
      });
      nameInput.current.focus();	// nameInput.current가 특정 DOM을 가리킴.
    };


    // 비밀번호 변경
    const [password, setPassword] = useState("");
    const [disabled, setDisabled] = useState(false);
    const handleChange = ({ target: { value } }) => setPassword(value);
  
    const handleSubmit = async (event) => {
      setDisabled(true);
      event.preventDefault();
      await new Promise((r) => setTimeout(r, 1000));
      if (password.length < 8) {
        alert("8자의 이상의 비밀번호를 사용해야 합니다.");
      } else {
        alert(`변경된 패스워드: ${password}`);
      }
      setDisabled(false);
    };
  
    return (
      <div> 
        <form onSubmit={handleSubmit}>
          <input
            name="nickname"
            value={nickname}
            placeholder="닉네임"
            onChange={onChange}
          />
          <button onClick={onReset}>닉네임 변경</button>
        </form> 
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="비밀번호"
            onChange={handleChange}
          />
          <button type="submit" disabled={disabled}>
            비밀번호 변경
          </button>
        </form>
      </div>
    );
}

 export default Profile;