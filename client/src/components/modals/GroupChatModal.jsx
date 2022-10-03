import { useEffect, useState } from "react";
import Modal from "./Modal";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { ChatState } from "../../contexts/ChatProvider";
import UserSearchResults from "../UserSearchResults";
import { MdOutlineCancel } from "react-icons/md";

const GroupChatModal = ({ showModal, setShowModal }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleAddGroupMember = (userToAdd) => {
    if (selectedUsers?.find((user) => user._id === userToAdd._id)) {
      toast.error("User already added to group chat");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const header = (
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
      Create Group Chat
    </h3>
  );

  const body = (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        className="text-sm border rounded px-4 py-2"
        placeholder="Chat Name"
        value={groupChatName}
        onChange={(event) => setGroupChatName(event.target.value)}
      />
      <input
        type="text"
        className="text-sm border rounded px-4 py-2"
        placeholder="Type user name to add to group chat"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {/* selected users display */}
      <ul
        className={
          selectedUsers.length > 0 ? "flex items-center gap-2" : "hidden"
        }
      >
        {selectedUsers.map((userItem, index) =>
          userItem._id === user._id ? (
            <li></li>
          ) : (
            <li
              key={index}
              className="bg-purple-500 text-white px-2 py-0.5 rounded-lg flex items-center gap-2"
            >
              <span>{userItem.name}</span>
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
            </li>
          )
        )}
      </ul>

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

  const btn1 = (
    <button
      className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
      onClick={() => setShowModal(!showModal)}
    >
      Create Group
    </button>
  );

  const btn2 = (
    <button
      type="button"
      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-200 rounded-lg border border-gray-300 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
      onClick={() => {
        setShowModal(!showModal);
        setSearch("");
        setSearchResults([]);
      }}
    >
      Clear data and close
    </button>
  );

  // search users using useEffect on changing search text
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
        console.log(error);
        toast.error(error.response.data.message);
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
        btn1={btn1}
        btn2={btn2}
        isForm={true}
        handleSubmit={handleSubmit}
      />
      <ToastContainer />
    </div>
  );
};

export default GroupChatModal;
