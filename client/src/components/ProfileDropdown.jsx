import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./modals/ProfileModal";

const ProfileDropdown = ({ user }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const wrapperRef = useRef();
  // on click outside of profile dropdown, setOpen to false
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [wrapperRef]);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex items-center relative" ref={wrapperRef}>
      <button
        className="w-10 h-10 rounded-full border-2 border-gray-300"
        onClick={() => setOpen(!open)}
      >
        <img
          src={user?.avatar}
          alt={user?.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      </button>
      {/* dropdown section */}
      <div className="absolute top-14 right-0 bg-white border border-gray-400 rounded-lg">
        {open ? (
          <ul className="min-w-[10rem] w-full whitespace-nowrap divide-y">
            <li className="hover:bg-gray-100 rounded-t-lg">
              <button
                className="px-6 py-2 w-full text-left"
                type="button"
                onClick={() => setShowModal(!showModal)}
              >
                My Profile
              </button>
            </li>
            <li className="hover:bg-gray-100">
              <button
                className="px-6 py-2 w-full text-left"
                type="button"
                onClick={logoutHandler}
              >
                Logout
              </button>
            </li>
          </ul>
        ) : (
          <ul></ul>
        )}
      </div>
      {/* Importing profile modal */}
      <ProfileModal
        user={user}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  );
};

export default ProfileDropdown;
