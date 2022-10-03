import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { getSender } from "../config/chat-logics";
import GroupChatModal from "./modals/GroupChatModal";

const ListOfChats = ({ chats, selectedChat, setSelectedChat, loggedUser }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (chats && !selectedChat) {
      setSelectedChat(chats[0]);
    }
  }, [chats, selectedChat, setSelectedChat]);

  // console.log(chats);

  return (
    <div className="flex flex-col justify-between px-4 py-6 bg-white w-full h-full">
      {/* list of chats header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-400">
        <h2>My Chats</h2>
        <button
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-2 py-1.5"
          type="button"
          onClick={() => setShowModal(!showModal)}
        >
          <div>New Group Chat</div>
          <AiOutlinePlus />
        </button>
      </div>
      <div className="flex flex-col py-3 w-full h-full rounded-lg overflow-y-hidden">
        {chats ? (
          <ul className="overflow-y-auto space-y-2">
            {chats.map((chat, index) => (
              <li
                key={index}
                onClick={() => setSelectedChat(chat)}
                className={`cursor-pointer flex items-center justify-between gap-4 px-3 py-2 rounded-lg ${
                  selectedChat === chat
                    ? "bg-[#38B2AC] text-white"
                    : "bg-[#E8E8E8] text-gray-600 hover:bg-gray-300"
                }`}
              >
                <div>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading....</p>
        )}
      </div>
      {/* Importing profile modal */}
      <GroupChatModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default ListOfChats;
