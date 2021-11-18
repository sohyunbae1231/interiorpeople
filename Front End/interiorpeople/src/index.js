import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

/** 쿠키 접근 */
import { CookiesProvider } from "react-cookie";

/** 유저 관련 컨텍스트 */
import { AuthProvider } from "./context/AuthContext";

ReactDOM.render(
  <CookiesProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
    ,
  </CookiesProvider>,
  document.getElementById("root")
);
export { default as Home } from "./Home";
