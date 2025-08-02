import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/userContext";
// import { useNavigate } from "react-router-dom";
import Login from "../pages/Login";

const UserAuth = ({ children }) => {
  const { user } = useContext(UserContext);
  const [Loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  // const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  // console.log(user);

  if (Loading) {
    return <div>Loading...</div>;
  }

  if (!token || !user) {
    // If no token and no user, redirect to login
    // navigate("/login");
    return <Login />;
  }

  return <>{children}</>;
};

export default UserAuth;
