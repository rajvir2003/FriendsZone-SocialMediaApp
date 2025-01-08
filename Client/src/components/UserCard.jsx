import React, { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import { Link } from "react-router-dom";

const UserCard = ({ user, closeModal }) => {
  const { user: currentUser, dispatch } = useContext(UserContext);
  const assets = import.meta.env.VITE_FRONTEND_ASSETS_URL;
  const uploads = import.meta.env.VITE_BACKEND_UPLOADS_URL;
  const [followStatus, setFollowStatus] = useState(() =>
    currentUser.requestedTo.includes(user._id)
      ? "Requested"
      : currentUser.following.includes(user._id)
      ? "Unfollow"
      : "Follow"
  );

  const handleFollowStatus = async () => {
    if (currentUser.requestedTo.includes(user._id)) return;
    if (!currentUser.following.includes(user._id)) {
      await axios.put(`/api/users/${user._id}/follow`, {
        userId: currentUser._id,
      });
      dispatch({
        type: user.isPrivate ? "SEND_REQUEST" : "FOLLOW",
        payload: user._id,
      });
      setFollowStatus(user.isPrivate ? "Requested" : "Unfollow");
    } else {
      await axios.put(`/api/users/${user._id}/unfollow`, {
        userId: currentUser._id,
      });
      dispatch({ type: "UNFOLLOW", payload: user._id });
      setFollowStatus("Follow");
    }
  };

  return (
    <div className="flex mb-4 items-center justify-between">
      <div className="flex gap-4 items-center">
        <Link onClick={closeModal} to={`/userProfile/${user._id}`}>
          <img
            src={
              user.profilePicture
                ? uploads + user.profilePicture
                : assets + "noAvatar.png"
            }
            className="block h-10 w-10 rounded-full object-cover"
            alt="user image"
            crossOrigin="anonymous"
          />
        </Link>

        <p className="font-medium">{user.username}</p>
      </div>
      {currentUser._id !== user._id && (
        <button
          onClick={handleFollowStatus}
          className="p-1.5 px-3 text-[15px] font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md"
        >
          {followStatus}
        </button>
      )}
    </div>
  );
};

export default UserCard;
