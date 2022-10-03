import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import ChatBox from "../components/ChatBox";
import ListOfChats from "../components/ListOfChats";
import TopBar from "../components/TopBar";
import { ChatState } from "../contexts/ChatProvider";

const ChatPage = () => {
  const [loggedUser, setLoggedUser] = useState();
  const [rerender, setRerender] = useState(false);
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios({
          method: "get",
          url: `http://localhost:5000/api/chat/fetch-chats`,
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        // console.log(response.data);
        setChats(response.data);
      } catch (e) {
        console.log(e);
        toast.error(`Something went wrong: ${e.response.data.message}`);
      }
    };

    setLoggedUser(JSON.parse(localStorage.getItem("user")));
    fetchChats();
  }, [setChats, user, rerender]);

  return (
    <div className="w-full h-screen bg-gray-100">
      <div className="h-full flex flex-col items-center justify-center">
        <TopBar />
        <div className="w-full flex-1">
          <div className="grid grid-cols-1 md:grid-cols-4 w-full h-full">
            <div className="col-span-1 h-full bg-white border-r border-gray-300">
              <ListOfChats
                chats={chats}
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                loggedUser={loggedUser}
              />
            </div>
            <div className="col-span-3">
              <ChatBox
                loggedUser={loggedUser}
                rerender={rerender}
                setRerender={setRerender}
              />
            </div>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
