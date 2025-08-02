import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const UserAuth = ({ children }) => {
  const { user } = useContext(UserContext);
  const [Loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
    if (!token) {
      navigate("/");
    }
    if (!user) {
      navigate("/");
    }
  }, [user]);

  if (Loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserAuth;
