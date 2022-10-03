import React from "react";
import { BsBell } from "react-icons/bs";

const Notification = () => {
  return (
    <div>
      <button className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center">
        <BsBell className="scale-150" />
      </button>
    </div>
  );
};

export default Notification;
