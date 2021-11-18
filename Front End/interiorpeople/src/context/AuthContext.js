import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();

  return (
    <AuthContext.Provider value={[currentUser, setCurrentUser]}>
      {children}
    </AuthContext.Provider>
  );
};
