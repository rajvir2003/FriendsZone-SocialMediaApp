import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home as HomeIcon,
  Notifications as ActivityIcon,
  Forum as MessageIcon,
  Favorite as LikedIcon,
  Bookmark as SavedIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { UserContext } from "../context/userContext";
import { SidebarContext } from "../context/sideBarContext";

const NavItem = ({ path, icon: Icon, label }) => {
  const { toggleBar } = useContext(SidebarContext);

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center hover:bg-gray-200 dark:hover:bg-[#181818] w-full p-2 rounded-lg ${
          isActive && "bg-gray-200 dark:bg-[#181818] shadow"
        }`
      }
      onClick={toggleBar}
    >
      <Icon sx={{ fontSize: 34 }} />
      <p className="ml-4 text-lg font-medium">{label}</p>
    </NavLink>
  );
};

const LeftBar = () => {
  const assets = import.meta.env.VITE_FRONTEND_ASSETS_URL;
  const uploads = import.meta.env.VITE_BACKEND_UPLOADS_URL;
  const { user } = useContext(UserContext);
  const { isOpen, toggleBar } = useContext(SidebarContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { path: "/", icon: HomeIcon, label: "Home" },
    { path: "/chats", icon: MessageIcon, label: "Chats" },
    { path: "/activity", icon: ActivityIcon, label: "Activity" },
    { path: "/liked", icon: LikedIcon, label: "Liked" },
    { path: "/saved", icon: SavedIcon, label: "Saved" },
  ];

  return (
    <div
      className={`${
        !isOpen ? "left-[-100%]" : "left-0 w-[60vw] sm:w-full z-10"
      } fixed shadow-md sm:static sm:col-span-6 lg:col-span-3 h-[calc(100vh-50px)] sm:h-[calc(100vh-58px)] transition-all duration-300`}
    >
      <div className="bg-white dark:bg-[#101010] dark:text-white w-full h-full">
        <div className="flex flex-col gap-0 mx-4 justify-evenly h-full">
          <NavLink
            to={`/userProfile/${user._id}`}
            className={({ isActive }) =>
              `flex items-center hover:bg-gray-200 hover:shadow dark:hover:bg-[#181818] p-2 rounded-lg ${
                isActive && "bg-gray-200 dark:bg-[#181818] shadow"
              }`
            }
            onClick={toggleBar}
          >
            <img
              src={
                user.profilePicture
                  ? uploads + user.profilePicture
                  : assets + "noAvatar.png"
              }
              alt="userImage"
              className="h-10 w-10 rounded-full object-cover shadow"
              crossOrigin="anonymous"
            />
            <div className="ml-3">
              <p className=" text-lg font-medium">{user.username}</p>
              <p className="text-sm opacity-80">@{user.email.split("@")[0]}</p>
            </div>
          </NavLink>
          <hr className="border-black border-opacity-40 dark:border-white dark:border-opacity-20" />
          <ul className="h-[65%] flex flex-col items-start gap-2">
            {navItems.map((item, index) => (
              <NavItem
                key={index}
                path={item.path}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </ul>
          <hr className="border-black border-opacity-40 dark:border-white dark:border-opacity-20" />
          <button onClick={()=>{setIsModalOpen(true)}} className="flex items-center hover:bg-gray-200 dark:hover:bg-[#181818] p-2 rounded-lg">
            <LogoutIcon sx={{ fontSize: 34 }} />
            <p className="ml-3.5 text-lg font-medium">Logout</p>
          </button>
        </div>
      </div>
      {isModalOpen && <LogoutModal closeModal={()=>{setIsModalOpen(false)}} />}
    </div>
  );
};

const LogoutModal = ({ closeModal }) => {
  const { dispatch } = useContext(UserContext);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#101010] p-6 rounded-lg shadow-lg text-center space-y-4 w-[90%] sm:w-[400px]">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Logout Confirmation
        </h2>
        <p className="dark:text-white opacity-80">
          Are you sure you want to log out?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={()=>{dispatch({ type: "LOGOUT", payload: null })}}
            className="px-4 py-2 font-medium bg-red-600 text-white rounded-md hover:bg-red-500"
          >
            Logout
          </button>
          <button
            onClick={closeModal}
            className="px-4 py-2 font-medium bg-gray-300 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
