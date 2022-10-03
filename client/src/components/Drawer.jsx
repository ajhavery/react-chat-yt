import { useEffect, useRef } from "react";
import axios from "axios";
import { ChatState } from "../contexts/ChatProvider";
import { MdOutlineCancel } from "react-icons/md";
import { HiOutlineSearch } from "react-icons/hi";
import UserSearchResults from "./UserSearchResults";

const Drawer = ({
  loading,
  setLoading,
  showDrawer,
  setShowDrawer,
  search,
  setSearch,
  searchResult,
  setSearchResult,
  accessChat,
}) => {
  const { user } = ChatState();
  const drawerRef = useRef();

  // close drawer on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setShowDrawer(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [drawerRef, setShowDrawer]);

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
        setSearchResult(response.data.users);
      } catch (error) {
        console.log("error", error);
      }
    };

    const delayedResponse = setTimeout(async () => {
      if (search !== undefined && search.length !== 0 && search !== null) {
        await searchUsers();
      } else {
        setSearchResult([]);
      }
    }, 500);

    return () => {
      clearTimeout(delayedResponse);
    };
  }, [search, setLoading, setSearchResult, user]);

  //   console.log(searchResult);

  return (
    <div
      ref={drawerRef}
      className={`fixed z-40 top-0 left-0 bottom-0 h-screen overflow-x-hidden overflow-y-auto bg-gray-100 transition-all ease-in-out duration-200 ${
        showDrawer ? "w-80" : "w-0"
      }`}
      tabIndex="-1"
    >
      <div className={`p-4 ${showDrawer ? "scale-100" : "scale-0"}`}>
        {/* header section */}
        <div className="border-b border-gray-400">
          <h2 className="text-base font-semibold text-gray-600 mb-4">
            Search Users
          </h2>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={() => {
              setShowDrawer(!showDrawer);
            }}
          >
            <MdOutlineCancel className="w-6 h-6" />
            <span className="sr-only">Close Side drawer</span>
          </button>
        </div>
        {/* content section */}
        <div className="py-4">
          {/* search box */}
          <div className="bg-white border-2 flex items-center gap-4 px-4 py-2">
            <HiOutlineSearch className="scale-150" />
            <input
              type="text"
              className="outline-none"
              placeholder="Search users..."
              value={search || ""}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* search results */}
          <div className="mt-4">
            <UserSearchResults
              loading={loading}
              searchResults={searchResult}
              handleClick={accessChat}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
