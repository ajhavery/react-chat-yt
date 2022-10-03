import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { ChatState } from "../contexts/ChatProvider";
import SendMessageBox from "./single-chat/SendMessageBox";
import SingleChatDisplay from "./single-chat/SingleChatDisplay";
import SingleChatHeader from "./single-chat/SingleChatHeader";

import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const ChatBox = ({ rerender, setRerender }) => {
  const { user, selectedChat } = ChatState();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const response = await axios({
        method: "get",
        url: `http://localhost:5000/api/message/${selectedChat?._id}`,
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setLoading(false);
      setMessages(response.data);

      // create a new room with id of selectedChat
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // Step 1: Fetch all messages for the chat
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // console.log(messages);

  // Step 2: Handle typing a new message
  const handleTyping = (event) => {
    setNewMessage(event.target.value);

    // Logic to indicate when the other user is typing
    if (!socketConnected) return;

    // will run everytime a key is pressed
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat?._id);
    }

    // stop typing 3 seconds after no key is pressed
    const lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff > timerLength && typing) {
        socket.emit("stop typing", selectedChat?._id);
        setTyping(false);
      }
    }, timerLength);
  };

  // Step 3: Send a new message
  const sendMessage = async (event) => {
    event.preventDefault();
    socket.emit("stop typing", selectedChat?._id);
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:5000/api/message/send-message",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        data: {
          content: newMessage,
          chatId: selectedChat?._id,
        },
      });

      setNewMessage("");
      socket.emit("new message", response.data);
      // apend newMessage to messages array
      setMessages([...messages, response.data]);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  /********* SOCKET FUNCTIONS *************/

  // Step 1: setup socket connection: create new room with user._id
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [user]);

  // Step 2: receive new messages using socket
  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  }, [messages]);

  // console.log(selectedChat);

  return (
    <div className="h-full w-full bg-gray-100 py-6 px-4 space-y-4">
      {/* chat box header  */}
      <SingleChatHeader
        rerender={rerender}
        setRerender={setRerender}
        fetchMessages={fetchMessages}
      />
      <div className="h-[25rem] overflow-y-auto p-4 border rounded-lg w-full bg-white shadow">
        <SingleChatDisplay
          rerender={rerender}
          setRerender={setRerender}
          loading={loading}
          messages={messages}
          isTyping={isTyping}
        />
      </div>
      {/* enter new message */}
      <div className="w-full p-4 border rounded-lg bg-white shadow">
        <SendMessageBox
          rerender={rerender}
          setRerender={setRerender}
          loading={loading}
          newMessage={newMessage}
          handleTyping={handleTyping}
          handleSubmit={sendMessage}
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChatBox;
