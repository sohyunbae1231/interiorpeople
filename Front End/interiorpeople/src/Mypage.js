import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const Mypage = () => {
    return (
      <div>
        <ul>
            <li><Link to="/mypage/profile">프로필 편집</Link></li>
            <li><Link to="/mypage/myphoto">나의 사진</Link></li>
            <li><Link to="/mypage/scrap">스크랩</Link></li>
            <li><Link to="/mypage/history">추천 기록</Link></li>
        </ul>
        <hr/>
      </div>
    );
};

export default Mypage;