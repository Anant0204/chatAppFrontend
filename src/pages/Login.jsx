import { useState , useContext } from "react";
import { Link , useNavigate } from "react-router-dom";
import axios from "../config/axios"; // Adjust the import path as necessary
import { UserContext } from "../context/userContext"; // Import the UserContext


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext); // Access the setUser function from context

  const navigate = useNavigate();

   axios.defaults.baseURL = 'http://localhost:3000';

  const handleSubmit = (e) => {
    e.preventDefault();
        axios.post('/users/login', { 
          email, password 
        }).then((res) => {
          console.log("Login successful:", res.data);

          localStorage.setItem("token", res.data.token); // Store the token in localStorage
          setUser(res.data.user); // Set the user in context
          navigate("/");
        }).catch((error) => {
          console.error("Login failed:", error);
        });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* email */}
          <div>
            <label htmlFor="email" className="text-gray-300 block mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          {/* password */}
          <div>
            <label htmlFor="password" className="text-gray-300 block mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
