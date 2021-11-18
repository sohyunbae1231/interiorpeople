import React, { createContext, useState, useEffect } from "react";
import { Cookies } from "react-cookie";

const cookies = new Cookies();
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const userConnectSid = cookies.get("connect.sid");
    if (userConnectSid) {
      setUser(userConnectSid);
    } else {
      setUser();
    }
  }, [user]);

  return (
    <AuthContext.Provider value={[user, setUser]}>
      {children}
    </AuthContext.Provider>
  );
};
