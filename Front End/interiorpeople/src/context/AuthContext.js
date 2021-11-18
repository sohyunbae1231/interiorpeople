import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();

  // ! 테스트 용 삭제 필요
  // useEffect(() => {
  //   if (!user) {
  //     loginHandler();
  //   }
  //   console.log(user);
  //   console.log(cookies.get("connect.sid"));
  // }, [user]);

  // // 매번 세션id를 지정할 필요 없이 세션id가 존재하면 바로 지정하게 해줌
  // useEffect(() => {
  //   const sessionId = localStorage.getItem("sessionId");
  //   if (user) {
  //     axios.defaults.headers.common.sessionid = user.sessionId;
  //     localStorage.setItem("sessionId", user.sessionId);
  //   } else if (sessionId) {
  //     // 새로고침을 해도 로그인이 안풀리도록 함
  //     axios
  //       .get("/users/user", { headers: { sessionid: sessionId } })
  //       .then((result) => {
  //         setuser({
  //           nauser: result.data.nauser,
  //           userId: result.data.userId,
  //           sessionId: result.data.sessionId,
  //         });
  //       })
  //       .catch(() => {
  //         localStorage.removeItem("sessionId");
  //         delete axios.defaults.headers.common.sessionid;
  //       });
  //   } else {
  //     delete axios.defaults.headers.common.sessionid;
  //   }
  // }, [user]);
  return (
    <AuthContext.Provider value={[user, setUser]}>
      {children}
    </AuthContext.Provider>
  );
};
