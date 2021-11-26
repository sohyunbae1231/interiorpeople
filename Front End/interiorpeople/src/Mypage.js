import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import "./fonts/mypage.css";

// <ul></ul> 부분 고치기!! -> 깨져서 나옴

const Mypage = () => {
    return (
      <div>
        <img src={require("./img/profile.png").default} style={{height: "90px", left: "0", marginLeft:"20%", marginTop:"30px", float:"left"}}/>
        <div class="explanation-group" style={{marginTop: "40px", display: "inline-block" }}>
          <div style={{marginLeft:"35%"}}></div>
          <div style={{marginLeft:"35%"}}></div>
          <button class="mypage-button-font" style={{ background: "#203864", color: "white", marginLeft:"35%", marginTop:"10px", width:"120%", borderRadius: "5px"}}><Link to="/mypage/profile">프로필 편집</Link></button>
        </div>
        <ul style={{width:"90%", margin: "10px auto", marginTop:"60px"}}>
            <li style={{float:"left", width:"30%"}}><Link to="/mypage/myphoto"><img src={require("./img/gallery.png").default} style={{width:"50%", display:"block"}}/>나의 사진</Link></li>
            <li style={{float:"left", width:"30%"}}><Link to="/mypage/scrap"><img src={require("./img/bookmark.png").default} style={{width:"68%", display:"block"}}/>스크랩</Link></li>
            <li style={{float:"left", width:"30%"}}><Link to="/mypage/history"><img src={require("./img/records.png").default} style={{width:"50%", display:"block"}}/>추천 기록</Link></li>
        </ul>
      </div>
    );
};

export default Mypage;