import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });

  const navigate = useNavigate();

  // 🐨 Todo: Exercise #4
  //  Step 5: Function `login` ทำหน้าที่สร้าง Request ไปที่ API POST /login
  const login = async (data) => {
    const result = await axios.post("http://localhost:4000/auth/login", data);

    //step :5
    const token = result.data.token;
    localStorage.setItem("token", token);

    //step:5
    const userDataFromToken = jwtDecode(token);
    setState({ ...state, user: userDataFromToken });
    navigate("/");
  };

  // 🐨 Todo: Exercise #2
  const register = async (data) => {
    await axios.post("http://localhost:4000/auth/register", data);
    navigate("/login");
  };

  const logout = () => {
    // 🐨 Todo: Exercise #7
    //  ให้เขียน Logic ของ Function `logout` ตรงนี้
    //  Function logout ทำหน้าที่ในการลบ JWT Token ออกจาก Local Storage
  };

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// this is a hook that consume AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
