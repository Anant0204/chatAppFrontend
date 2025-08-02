import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Project from "../pages/Project.jsx";
import UserAuth from "../auth/UserAuth.jsx";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <UserAuth>
              <Home />
            </UserAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/project"
          element={
            <UserAuth>
              <Project />
            </UserAuth>
          }
        />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
