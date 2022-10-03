import { useState } from "react";
import axios from "axios";
import { HiOutlineSearch } from "react-icons/hi";

import { ChatState } from "../contexts/ChatProvider";
import Drawer from "./Drawer";
import Notification from "./Notification";
import ProfileDropdown from "./ProfileDropdown";

const TopBar = () => {
  const { user, setSelectedChat, chats, setChats } = ChatState();

  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showDrawer, setShowDrawer] = useState(false);

  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const response = await axios({
        method: "post",
        url: `http://localhost:5000/api/chat/access-chat`,
        data: { userId: userId },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setLoading(false);

      // add the newly initiated chat to the chats list
      if (!chats.find((c) => c._id === response.data._id)) {
        setChats([...chats, response.data]);
      }

      setSelectedChat(response.data);
      setShowDrawer(!showDrawer);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white w-full px-4 py-2 border-b border-gray-300 shadow-lg z-20">
      {/* search bar */}
      <div
        className="bg-white border-2 flex items-center gap-4 px-4 py-2"
        onClick={() => setShowDrawer(!showDrawer)}
      >
        <HiOutlineSearch className="scale-150" />
        <input
          type="text"
          className="outline-none"
          placeholder="Search users..."
        />
      </div>
      {/* side drawer */}
      <Drawer
        loading={loading}
        setLoading={setLoading}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        search={search}
        setSearch={setSearch}
        searchResult={searchResult}
        setSearchResult={setSearchResult}
        accessChat={accessChat}
      />
      {/* heading */}
      <div>
        <h1 className="text-2xl">Talk App</h1>
      </div>
      {/* profile section */}
      <div className="flex items-center gap-4">
        <Notification />
        <ProfileDropdown user={user} />
      </div>
    </div>
  );
};

export default TopBar;
