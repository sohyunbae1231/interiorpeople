import React, { useState, useEffect } from 'react';
import axios from 'axios';
 
function Login() {
}
 
    return(
        <div>
        <button type="button" class="mypage-icon"><img src="img/mypage_icon.png" style="width:23px;"></button>
        <button type="button" class="home"><img src="img/logo.jpg" style="width:220px;"></button>
        </div>
          <div>
            <nav class="top-bar">
              <ul>
                <li>
                  <a href="home.html" class="line">
                    홈
                  </a>
                </li>
                <li>
                  <a href="mypage.html" class="line">
                    마이페이지
                  </a>
                </li>
                <li>
                  <a href="interior_analysis.html" class="line">
                    인테리어 추천
                  </a>
                </li>
                <li>
                  <a href="community_home.html" class="line">
                    커뮤니티
                  </a>
                </li>
                <li>
                  <a href="contact.html" class="line">
                    고객센터
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div class="main-board">
            <div class="icon-group">
              <img class="profile" src="img/profile.png" style="width:150px;">
            </div>
            <div class="text-group">
              <div class="big-black-text">배소현</div>
              <div class="small-gray-text">sht06025@naver.com</div>
              <div>
                <button type="button" class="icon-image"><img src="img/edit_profile.png" style="height:25px;"></button>
              </div>
            </div>  
          </div>
          <div class="main-board">
            <div class="icon-group">
              <div class="icon-image">
                <button type="button" class="icon-image"><img src="img/gallery.png" style="width:48px;"></button>
              </div>
              <div class="icon-text">
                <a class="icon-text" href="index.html">나의 사진</a>
              </div>
            </div>
            <div class="icon-group">
              <div class="icon-image">
                <button type="button" class="icon-image"><img src="img/bookmark.png" style="width:63px;"></button>
              </div>
              <div class="icon-text">
                <a class="icon-text" href="index.html">스크랩</a>
              </div>
            </div>
            <div class="icon-group">
              <div class="icon-image">
                <button type="button" class="icon-image"><img src="img/records.png" style="width:40px;"></button>
              </div>
              <div class="icon-text">
                <a class="icon-text" href="index.html">추천 기록</a>
              </div>
            </div>
          </div>
    )
}
 
export default Login;