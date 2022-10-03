import { useState } from "react";
import { ChatState } from "../../contexts/ChatProvider";
import { getSender, getSenderDetails } from "../../config/chat-logics";
import UpdateGroupModal from "../modals/UpdateGroupModal";
import ProfileModal from "../modals/ProfileModal";

const SingleChatHeader = ({ rerender, setRerender, fetchMessages }) => {
  const [showModal, setShowModal] = useState(false);
  const { user, selectedChat } = ChatState();

  return (
    <div className="w-full p-4 border rounded-lg bg-white shadow">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-gray-600">
          {user && selectedChat
            ? !selectedChat.isGroupChat
              ? getSender(user, selectedChat.users)
              : selectedChat.chatName
            : ""}
        </div>
        <button
          className="px-2 py-1 rounded border border-gray-300 bg-gray-200 hover:bg-gray-300"
          type="button"
          onClick={() => setShowModal(!showModal)}
        >
          View details
        </button>
      </div>
      {selectedChat &&
        (selectedChat.isGroupChat ? (
          <UpdateGroupModal
            showModal={showModal}
            setShowModal={setShowModal}
            rerender={rerender}
            setRerender={setRerender}
            fetchMessages={fetchMessages}
          />
        ) : (
          <ProfileModal
            user={getSenderDetails(user, selectedChat.users)}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        ))}
    </div>
  );
};

export default SingleChatHeader;
