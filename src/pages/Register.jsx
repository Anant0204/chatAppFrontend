import { useState , useContext} from "react";
import { Link , useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { UserContext } from "../context/userContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Access the setUser function from context

  // axios.defaults.baseURL = 'http://localhost:3000';
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/users/register', { 
      email, password 
    }).then((res) => {
      localStorage.setItem("token", res.data.token); // Store the token in localStorage
      setUser(res.data.user); // Set the user in context
      console.log("Registration successful:", res.data);
      navigate("/");
    }).catch((error) => {
      console.error("Registration failed:", error);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Register</h2>

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
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account{" "}
          {/* <Link to="/login" className="text-blue-400 hover:underline"> */}
          <Link to="/" className="text-blue-400 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
