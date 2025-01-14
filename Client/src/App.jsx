import React, { useContext, useEffect } from "react";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { UserContext } from "./context/userContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Friends from "./pages/Friends.jsx";
import Chats from "./pages/Chats.jsx";
import Liked from "./pages/Liked.jsx";
import Saved from "./pages/Saved.jsx";
import Messages from "./pages/Messages.jsx";
import { ToastContainer } from "react-toastify";
import Layout from "./Layout.jsx";
import axios from "axios";

function App() {
  const { user, dispatch } = useContext(UserContext);
  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  useEffect(() => {
    const fetchUserData = async() => {
      const res = await axios.get(`/api/users/${user._id}`);
      console.log("update data");
      dispatch({ type: "UPDATE_DATA", payload: res.data });
    }
    if(user) fetchUserData();
  }, [dispatch]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<Home />} />
          <Route path="userProfile/:userId" element={<UserProfile />} />
          <Route path="friends" element={<Friends />} />
          <Route path="chats" element={<Chats />} />
          <Route path="liked" element={<Liked />} />
          <Route path="saved" element={<Saved />} />
          <Route path="messages/:chatId/:senderId" element={<Messages />} />
        </Route>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
      </>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer autoClose={2000} />
    </>
  );
}

export default App;
