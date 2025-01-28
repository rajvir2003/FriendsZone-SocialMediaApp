import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { ThemeContext } from "../context/themeContext";
import axios from "axios";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { DarkMode, LightMode } from '@mui/icons-material';

const Login = () => {
  const { dispatch } = useContext(UserContext);
  const { theme, changeTheme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const loginUser = async (userCredentials, dispatch) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/login", userCredentials);
      dispatch({ type: "LOGIN", payload: response.data });
      toast.success("logged in successfully", { theme });
    } catch (error) {
      toast.error(error.response.data.message, { theme });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userCredentials = {
      username: formData.username,
      password: formData.password
    }
    loginUser(userCredentials, dispatch);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({...formData, [name]: value});
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#171717] flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-[#101010] shadow-equal rounded-lg p-6">
        <h2 className="text-[35px] sm:text-[45px] text-center dark:text-white italianno-regular">FriendsZone</h2>
        <p className="sm:text-lg text-center text-gray-600 dark:text-gray-400 mb-4">
          Log in to your account.
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className={`mt-1 block w-full px-4 py-2 bg-gray-100 dark:bg-[#181818] text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${theme === "dark" && "custom-autofill"}`}
                placeholder="Enter your username"
                onChange={handleChange}
                value={formData.username}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 block w-full px-4 py-2 bg-gray-100 dark:bg-[#181818] text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter your password"
                onChange={handleChange}
                value={formData.password}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-500 transition ease-in-out duration-200"
          >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : "Log in"}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <button onClick={changeTheme} className="fixed bottom-4 right-4 bg-gray-200 dark:bg-[#101010] border border-gray-400 rounded-lg dark:text-white p-3 z-50" >
        {theme === 'light' ? (
          <LightMode sx={{ fontSize: 27 }} />
        ) : (
          <DarkMode sx={{ fontSize: 27 }} />
        )}
      </button>
    </div>
  );
};

export default Login;
