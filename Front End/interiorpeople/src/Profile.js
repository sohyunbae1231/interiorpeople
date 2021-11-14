import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 회원 이름 추가/변경(미완료), 프로필 사진 추가/변경(미완료), 비밀번호 변경(완료)

function Profile() {
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
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
        />
        <button type="submit" disabled={disabled}>
          비밀번호 변경
        </button>
      </form>
    );
}

 export default Profile;