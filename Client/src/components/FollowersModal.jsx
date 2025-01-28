import React, { useEffect, useState } from "react";
import { Close as CloseIcon } from "@mui/icons-material";
import UserCard from "./UserCard";
import axios from "axios";
import UserCardSkeleton from "./skeletons/UserCardSkeleton";

const FollowersModal = ({ closeModal, userId }) => {
  const [followers, setFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      const res = await axios.get(`/api/users/followers/${userId}`);
      setFollowers(res.data);
      setIsLoading(false);
    };
    fetchFollowers();
  }, [userId]);

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-30 dark:bg-opacity-70 backdrop-blur-sm">
        <div className="bg-white dark:bg-[#101010] rounded-lg dark:text-white">
          <div className="p-4 flex justify-between items-center">
            <h4 className="font-medium text-lg">Followers</h4>
            <CloseIcon onClick={closeModal} className="hover:opacity-60" />
          </div>
          <hr className="dark:opacity-30" />

          <div className="p-4 overflow-y-scroll scroll-smooth w-[85vw] h-[65vh] sm:w-[60vw] md:w-[45vw] lg:w-[30vw] scrollbar-thin">
            {isLoading ? (
              [...Array(10)].map((_, index) => {
                return <UserCardSkeleton key={index} />;
              })
            ) : followers.length > 0 ? (
              followers.map((follower) => {
                return (
                  <UserCard
                    user={follower}
                    closeModal={closeModal}
                    key={follower._id}
                  />
                );
              })
            ) : (
              <div className="h-full w-full flex justify-center items-center">
                <p className="text-xl font-bold">No Followers</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FollowersModal;
