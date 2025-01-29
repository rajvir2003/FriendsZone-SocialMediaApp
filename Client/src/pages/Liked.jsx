import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { ThemeContext } from "../context/themeContext";
import Post from "../components/Post";
import axios from "axios";
import { toast } from "react-toastify";
import PostSkeleton from "../components/skeletons/PostSkeleton";

const Liked = () => {
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const [likedPosts, setLikedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await axios.get(`api/posts/timeline/${user._id}`);
        const posts = response.data;
        setLikedPosts(posts.filter((post) => post.likes.includes(user._id)));
      } catch (error) {
        console.error("Error fetching liked posts:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLikedPosts();
  }, [user._id]);

  const removePost = async (postId) => {
    try {
      await axios.delete(`/api/posts/${postId}`, { data: { userId: user._id }});
      setLikedPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      toast.info("Post deleted successfully!", { theme });
    } catch (error) {
      console.error("Error deleting post:", error.message);
      toast.error("Failed to delete post. Please try again.", { theme });
    }
  };

  return (
    <>
      <div className="bg-white text-xl sm:text-2xl font-bold text-center p-3 mb-5 shadow rounded-lg dark:bg-[#101010] dark:text-white">
        Liked Posts
      </div>
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <PostSkeleton key={index} />
          ))
        : likedPosts.length > 0 ? likedPosts.map((post) => (
            <Post post={post} user={post.user} deletePost={removePost} key={post._id} />
          ))
        : <div className="h-[50vh] px-5 flex items-center justify-center dark:text-white">
            <div className="text-center">
              <p className="text-2xl font-medium mb-2">You haven't liked any posts yet.</p>
              <p className="text-lg opacity-80">Explore your timeline and like posts that inspire you!</p>
            </div>
          </div>}
    </>
  );
};

export default Liked;
