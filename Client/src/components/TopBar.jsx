import React, { useContext, useState } from "react";
import {
  GridViewOutlined,
  CloseOutlined,
  DarkMode,
  LightMode,
  SearchOutlined,
  EmailOutlined,
  NotificationsOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/themeContext";
import { UserContext } from "../context/userContext";
import { SidebarContext } from "../context/sideBarContext";
import axios from "axios";

const TopBar = () => {
  const assets = import.meta.env.VITE_FRONTEND_ASSETS_URL;
  const uploads = import.meta.env.VITE_BACKEND_UPLOADS_URL;
  const { theme, changeTheme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const { isOpen, toggleBar } = useContext(SidebarContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (event) => {
    const { value } = event.target;
    setSearchQuery(value);
    if (value.trim()) {
      try {
        const res = await axios.get(
          `/api/users/search?username=${value}`
        );
        setSearchResults(res.data);
      } catch (error) {
        console.log(error);
        setSearchResults([]);
      }
    } else setSearchResults([]);
  };

  return (
    <div className="flex bg-white z-20 items-center justify-between p-2 sm:p-2.5 shadow sticky top-0 dark:bg-[#171717] dark:text-white border-b border-b-white dark:border-opacity-10">
      {/* left */}
      <div className="flex gap-2.5 sm:gap-5 lg:gap-10 items-center w-[68%]">
        <div className="sm:hidden ml-1">
          {isOpen ? (
            <CloseOutlined onClick={toggleBar} />
          ) : (
            <GridViewOutlined onClick={toggleBar} />
          )}
        </div>
        <div className="hidden sm:block text-xl sm:text-2xl font-bold text-blue-700 sm:mx-3">
          FriendsZone
        </div>
        <div className="relative w-full lg:w-[630px]">
          <div className="flex items-center p-1 sm:p-1.5 rounded-md border border-gray-400 dark:border-opacity-40 w-full">
            <SearchOutlined />
            <input
              type="text"
              placeholder="Search..."
              className="ml-1 sm:ml-2 bg-transparent outline-none w-full"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          {searchResults.length > 0 && (
            <div className="absolute bg-white dark:bg-[#171717] dark:text-white shadow rounded-b-md max-h-60 w-full overflow-y-auto z-10">
              {searchResults.map((result) => {
                return (
                  <SearchResult
                    key={result._id}
                    user={result}
                    closeResults={() => {
                      setSearchResults([]);
                      setSearchQuery([]);
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* right */}
      <div className="flex gap-2.5 sm:gap-5 items-center">
        {theme === "light" ? (
          <LightMode onClick={changeTheme} />
        ) : (
          <DarkMode onClick={changeTheme} />
        )}
        <div className="hidden sm:block">
          <EmailOutlined />
        </div>
        <NotificationsOutlined />
        <div className="user">
          <img
            src={
              user.profilePicture
                ? uploads + user.profilePicture
                : assets + "noAvatar.png"
            }
            alt="userImage"
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full mr-2 object-cover shadow"
            crossOrigin="anonymous"
          />
        </div>
      </div>
    </div>
  );
};

const SearchResult = ({ user, closeResults }) => {
  const assets = import.meta.env.VITE_FRONTEND_ASSETS_URL;
  const uploads = import.meta.env.VITE_BACKEND_UPLOADS_URL;
  return (
    <div className="flex items-center justify-between">
      <Link
        onClick={closeResults}
        to={`/userProfile/${user._id}`}
        className="px-4 py-2 flex gap-3 sm:gap-4 items-center w-full hover:bg-[#eeeeee] dark:hover:bg-[#222222]"
      >
        <img
          src={
            user.profilePicture
              ? uploads + user.profilePicture
              : assets + "noAvatar.png"
          }
          className="block h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover"
          alt="user image"
          crossOrigin="anonymous"
        />
        <p>{user.username}</p>
      </Link>
    </div>
  );
};

export default TopBar;
