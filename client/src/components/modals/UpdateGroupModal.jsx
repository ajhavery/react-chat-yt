import { useEffect, useState } from "react";
import Modal from "./Modal";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { ChatState } from "../../contexts/ChatProvider";
import UserSearchResults from "../UserSearchResults";
import { MdOutlineCancel } from "react-icons/md";

const UpdateGroupModal = ({
  showModal,
  setShowModal,
  rerender,
  setRerender,
  fetchMessages,
}) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  /**
   * Step 1: If selected chat, then update chatName and users from it
   * Step 2: Handler function to add a new user to the group
   * Step 3: Handler function to remove a user from the group
   * Step 4: Handler function to rename a group
   * Step 5: search users using useEffect on changing search text
   * Step 6: Handle creation of a new group
   */

  // Step 1: If selected chat, then update chatName and users from it
  useEffect(() => {
    if (selectedChat && selectedChat.isGroupChat) {
      setGroupChatName(selectedChat.chatName);
      setSelectedUsers(selectedChat.users);
    }
  }, [selectedChat]);

  // Step 2: Handler function to add a new user to the group
  const handleAddGroupMember = async (userToAdd) => {
    if (selectedUsers?.find((user) => user._id === userToAdd._id)) {
      toast.error("User already added to group chat");
      return;
    }

    // Only group admin can add new members to group
    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admin can add new members to group chat");
      return;
    }

    setLoading(true);
    try {
      const response = await axios({
        method: "PUT",
        url: "http://localhost:5000/api/chat/add-to-group",
        data: {
          chatId: selectedChat?._id,
          userId: userToAdd._id,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setSelectedChat(response.data);
      setRerender(!rerender);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // Step 3: Handler function to remove a user from the group
  const handleRemoveGroupMember = async (userToRemove) => {
    // Only group admin can remove members from group
    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admin can remove members from group chat");
      return;
    }

    setLoading(true);
    try {
      const response = await axios({
        method: "PUT",
        url: "http://localhost:5000/api/chat/remove-from-group",
        data: {
          chatId: selectedChat?._id,
          userId: userToRemove._id,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      // if user himself leaves the group
      userToRemove._id === user._id
        ? setSelectedChat()
        : setSelectedChat(response.data);
      setRerender(!rerender);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // Step 4: Handler function to rename a group
  const handleRenameGroup = async () => {
    if (!groupChatName) return;
    setLoading(true);
    try {
      const response = await axios({
        method: "PUT",
        url: "http://localhost:5000/api/chat/rename-group",
        data: {
          chatId: selectedChat?._id,
          chatName: groupChatName,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setLoading(false);
      setRerender(!rerender);
      setSelectedChat(response.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  /**************************************************************************
   * Modal Header, Body and action buttons
   **************************************************************************/

  const header = (
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
      {groupChatName}
    </h3>
  );

  // if user is admin, show cross button agains memebers name, else show only name
  // even if user is admin, do not show cross button against his own name
  const body = (
    <div className="flex flex-col gap-4">
      {/* selected users display */}
      <div className="space-y-4">
        {selectedChat.groupAdmin._id === user._id ? (
          <h4>Click on cross against user name to remove from the group:</h4>
        ) : (
          <h4>Group members:</h4>
        )}
        <ul
          className={
            selectedUsers.length > 0 ? "flex items-center gap-2" : "hidden"
          }
        >
          {selectedUsers.map((userItem, index) =>
            userItem._id === user._id ? (
              <li
                key={index}
                className="bg-purple-500 text-white px-2 py-0.5 rounded-lg flex items-center gap-2"
              >
                {userItem._id === selectedChat.groupAdmin._id ? (
                  <span className="font-bold">{userItem.name} (admin)</span>
                ) : (
                  <span>{userItem.name}</span>
                )}
              </li>
            ) : (
              <li
                key={index}
                className="bg-purple-500 text-white px-2 py-0.5 rounded-lg flex items-center gap-2"
              >
                {userItem._id === selectedChat.groupAdmin._id ? (
                  <span className="font-bold">{userItem.name} (admin)</span>
                ) : (
                  <span>{userItem.name}</span>
                )}
                {selectedChat.groupAdmin._id === user._id && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedUsers(
                        selectedUsers.filter((u) => u._id !== userItem._id)
                      )
                    }
                  >
                    <MdOutlineCancel />
                  </button>
                )}
              </li>
            )
          )}
        </ul>
      </div>

      <div className="flex items-center gap-2 w-full">
        <input
          type="text"
          className="text-sm border border-gray-400 rounded px-4 py-2 w-full"
          placeholder="Chat Name"
          value={groupChatName}
          onChange={(event) => setGroupChatName(event.target.value)}
        />
        <button
          type="button"
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-200 rounded-lg text-sm px-5 py-2.5 whitespace-nowrap"
          onClick={handleRenameGroup}
        >
          Update Group Name
        </button>
      </div>
      <div className="space-y-4">
        <h4>Type name to search users, click on name to add to group</h4>
        <input
          type="text"
          className="text-sm border border-gray-400 rounded px-4 py-2 w-full"
          placeholder="Type user name to add to group chat"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {/* render search results here */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        // show only the first 4 results
        <div>
          <UserSearchResults
            loading={loading}
            searchResults={searchResults}
            handleClick={handleAddGroupMember}
          />
        </div>
      )}
    </div>
  );

  const btn2 = (
    <button
      type="button"
      className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-200 rounded-lg text-sm px-5 py-2.5"
      onClick={() => {
        setShowModal(!showModal);
        setSearch("");
        setSearchResults([]);
        handleRemoveGroupMember(user);
      }}
    >
      Leave Group
    </button>
  );

  // Step 5: search users using useEffect on changing search text
  useEffect(() => {
    const searchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios({
          method: "get",
          url: `http://localhost:5000/api/user/get-all-users/?search=${search}`,
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setLoading(false);
        // console.log(response.data);
        setSearchResults(response.data.users);
      } catch (error) {
        console.log("error", error);
      }
    };

    const delayedResponse = setTimeout(async () => {
      if (search !== undefined && search.length !== 0 && search !== null) {
        await searchUsers();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => {
      clearTimeout(delayedResponse);
    };
  }, [search, setLoading, setSearchResults, user]);

  // Step 6: Handle creation of a new group
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.error("Please enter group name and select participants");
      return;
    }
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:5000/api/chat/create-group",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        data: {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
      });
      console.log("group create response: " + response);
      setChats([response.data, ...chats]);
      setShowModal(false);
      toast.success("Group created successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // console.log(chats);
  // console.log(selectedUsers);

  return (
    <div>
      <Modal
        show={showModal}
        setShow={setShowModal}
        header={header}
        body={body}
        btn2={btn2}
        isForm={true}
        handleSubmit={handleSubmit}
      />
      <ToastContainer />
    </div>
  );
};

export default UpdateGroupModal;
