import React, { useState, useEffect } from 'react';
import axios from 'axios';
 
function Login() {
    const [inputId, setInputId] = useState('')
    const [inputPw, setInputPw] = useState('')
 
    const handleInputId = (e) => {
        setInputId(e.target.value)
    }
 
    const handleInputPw = (e) => {
        setInputPw(e.target.value)
    }
 
    const onClickLogin = () => {
        console.log('click login')
    }
 
    useEffect(() => {
        axios.get('/user_inform/login')
        .then(res => console.log(res))
        .catch()
    },
    [])
 
    return(
        <div>
            <h2>로그인</h2>
            <div>
                <input type='text' name='input_id' value={inputId} onChange={handleInputId} placeholder='아이디'/>
            </div>
            <div>
                <input type='password' name='input_pw' value={inputPw} onChange={handleInputPw} placeholder='비밀번호'/>
            </div>
            <div>
                <button type='button' onClick={onClickLogin}>로그인</button>
            </div>
            <div>
                <ul class="login">
                    <li><a href="home.html">아이디/비밀번호 찾기</a></li>
                    <li><a href="signup.html">회원가입</a></li>
                </ul>
            </div>
            <div>
                <h4>SNS계정으로 간편 로그인/회원가입</h4>
                <a href="facebook.html"><img src="img/facebook.png" width="48" height="48"></img></a>
                <a href="kakao.html"><img src="img/kakao.png" width="48" height="48"></img></a>
                <a href="naver.html"><img src="img/naver.png" width="48" height="48"></img></a>
            </div>
        </div>
    )
}
 
export default Login;