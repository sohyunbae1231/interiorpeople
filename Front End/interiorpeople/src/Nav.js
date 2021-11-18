import React, { useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";

/** 유저 인증 관련 컨텍스트 */
import { AuthContext } from "./context/AuthContext";

function Nav() {
  const [user, setUser] = useContext(AuthContext);
  const cookies = new Cookies();
  const logoutHandler = async () => {
    try {
      // 두번째 인자는 req.body이고 세번째 인자는 설정임
      await axios.get("/account/logout");
      setUser();
      cookies.remove("connect.sid");
      // alert("로그아웃되었습니다.");
      window.location.replace("/");
    } catch (err) {
      // console.error(err);
      alert(err.message);
    }
  };

  return (
    <div>
      <div class="home">
        <img
          alt=""
          src={require("./img/logo.jpg").default}
          style={{ width: "50%", marginLeft: "15%" }}
        />
      </div>
      <div style={{ paddingBottom: "0.5rem" }}>
        {/* 로그인이 되어있으면 로그아웃만 보임 */}
        {/* 로그인이 되어 있지 않으면 로그인,회원가입이 보임 */}
        {user ? (
          <button
            onClick={logoutHandler}
            style={{ float: "right", cursor: "pointer" }}
          >
            로그아웃
          </button>
        ) : (
          <>
            <button
              onClick={logoutHandler}
              style={{ float: "right", cursor: "pointer" }}
            >
              로그아웃
            </button>
            <Link to="./login">
              <button style={{ float: "right" }}>로그인{user}</button>
            </Link>
            <Link to="./signup">
              <button style={{ float: "right" }}>회원가입</button>
            </Link>
          </>
        )}
      </div>
      <ul>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/mypage">마이페이지</Link>
        </li>
        <li>
          <Link to="/interior/upload">인테리어 추천</Link>
        </li>
        <li>
          <Link to="/community">커뮤니티</Link>
        </li>
        <li>
          <Link to="/support">고객센터</Link>
        </li>
      </ul>
      <hr />
    </div>
  );
}

export default Nav;
