import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import {
  KeyboardBackspace as BackIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import socket from "../socketConnection";
import { v4 as uuidv4 } from "uuid";

const Messages = () => {
  const assets = import.meta.env.VITE_FRONTEND_ASSETS_URL;
  const uploads = import.meta.env.VITE_BACKEND_UPLOADS_URL;
  const navigate = useNavigate();
  const { chatId, senderId } = useParams();
  const { user } = useContext(UserContext);
  const [sender, setSender] = useState({});
  const [messages, setMessages] = useState([]);
  const messageText = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const scrollRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    socket.emit("addUser", user._id);
    socket.on("getUsers", users => {
      setOnlineUsers(users);
    })
  }, [user._id]);  

  useEffect(() => {
    const fetchSender = async () => {
      const res = await axios.get(`/api/users/${senderId}`);
      setSender(res.data);
    };
    const fetchMessages = async () => {
      const res = await axios.get(`/api/messages/${chatId}`);
      setMessages(res.data);
    };
    fetchSender();
    fetchMessages();
  }, [chatId, senderId]);

  useEffect(() => {
    const handleMessage = ({ senderId, content }) => {
      const newMessage = { senderId, content, createdAt: Date.now() };
      setMessages((prev) => [...prev, newMessage]); // Update messages directly
    };
  
    socket.on("getMessage", handleMessage);
  
    return () => {
      // Cleanup to prevent duplicate listeners
      socket.off("getMessage", handleMessage);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const newMessage = {
        chatId: chatId,
        senderId: user._id,
        content: messageText.current.value,
      };
      await axios.post(`/api/messages`, newMessage);
      if(onlineUsers.some((user) => user.userId === senderId)){
        console.log("message sent on other side")
        socket.emit("sendMessage", { 
          senderId: user._id,
          recieverId: senderId, // senderId is other user's id
          content: messageText.current.value
        })
      }
      messageText.current.value = "";
      setIsLoading(false);
      setMessages([...messages, newMessage]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-[100%] flex flex-col justify-between shadow-md bg-white dark:bg-[#171717] dark:text-white rounded-lg">
      <div className="p-2 py-3 flex gap-4 items-center">
        <BackIcon
          onClick={() => {
            navigate(-1);
          }}
          className="hover:opacity-70"
          sx={{ fontSize: 30 }}
        />
        <img
          src={
            sender.profilePicture
              ? uploads + sender.profilePicture
              : assets + "noAvatar.png"
          }
          className="block h-10 w-10 rounded-full object-cover"
          alt="sender image"
          crossOrigin="anonymous"
        />
        <h4 className="font-medium text-xl">{sender.username}</h4>
      </div>
      <hr className="border border-black dark:border-white opacity-15" />

      <div className="h-full py-2 overflow-y-scroll scroll-smooth scrollbar-thin pl-2">
        {messages.map((message) => {
          return (
            <div key={uuidv4()} ref={scrollRef}>
              <Message
                senderId={message.senderId}
                content={message.content}
              />
            </div>
          );
        })}
      </div>
      <hr className="border border-black dark:border-white opacity-15" />

      <div className="p-3">
        <form
          onSubmit={handleSubmit}
          className="flex gap-3 justify-between items-center"
        >
          <input
            type="text"
            placeholder="Send Message"
            className="block w-full border border-gray-300 bg-transparent outline-none shadow rounded p-2 dark:border-opacity-20"
            ref={messageText}
          />
          <button
            type="submit"
            className="flex justify-center items-center p-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white"
          >
            {isLoading ? (
              <CircularProgress
                className="text-center"
                size={24}
                color="inherit"
              />
            ) : (
              <SendIcon sx={{ fontSize: 28 }} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const Message = ({ senderId, content }) => {
  const { user } = useContext(UserContext);

  return (
    <div
      className={`pt-2 pb-1 px-1 flex ${
        senderId === user._id ? "justify-end" : "justify-start"
      }`}
    >
      <p
        className={`p-2 max-w-[75%] rounded-lg ${
          senderId === user._id
            ? "rounded-tr-none bg-gray-200 dark:bg-[#252525] dark:text-white"
            : "rounded-tl-none bg-purple-600 text-white"
        }`}
      >
        {content}
      </p>
    </div>
  );
};

export default Messages;
