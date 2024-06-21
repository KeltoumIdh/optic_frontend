import { createContext, useContext, useState } from "react";
import AuthApi from "../services/Api/Auth/AuthApi";
import { axiosAuth } from "../api/axios";
import { useNavigate } from "react-router-dom";

export const AuthStateContext = createContext({
  user: {},
  authenticated: false,
  setUser: () => {},
  logout: () => {},
  login: (email, password) => {},
  setAuthenticated: () => {},
  setToken: () => {},
});
export default function AuthContext({ children }) {
  const [user, setUser] = useState({});

  const [authenticated, _setAuthenticated] = useState(
    "true" === window.localStorage.getItem("AUTHENTICATED") &&
      window.localStorage.getItem("optic-token") != null
  );
  //  const [authenticated, _setAuthenticated] = useState(false)

  const login = async (email, password) => {
    console.log;
    let auth = await AuthApi.login(email, password);
    window.localStorage.setItem("optic-token", auth?.data?.token);
    window.localStorage.setItem("isAuth", true);
    setAuthenticated(true);
    window.location.replace("/");
    console.log("auth", auth);
  };
  const logout = () => {
    axiosAuth.post("/logout").then(() => {
      setUser({});
      setAuthenticated(false);
      window.localStorage.setItem("optic-token", null);
      window.localStorage.setItem("isAuth", false);

    });
  };

  const setAuthenticated = (isAuthenticated) => {
    _setAuthenticated(isAuthenticated);
    window.localStorage.setItem("AUTHENTICATED", isAuthenticated);
  };

  const setToken = (token) => {
    window.localStorage.setItem("token", token);
  };

  return (
    <>
      <AuthStateContext.Provider
        value={{
          user,
          login,
          logout,
          setUser,
          authenticated,
          setAuthenticated,
          setToken,
        }}
      >
        {children}
      </AuthStateContext.Provider>
    </>
  );
}
export const useUserContext = () => useContext(AuthStateContext);
