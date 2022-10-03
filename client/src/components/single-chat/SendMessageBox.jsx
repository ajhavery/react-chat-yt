import React from "react";

const SendMessageBox = ({
  rerender,
  setRerender,
  loading,
  newMessage,
  handleTyping,
  handleSubmit,
}) => {
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div className="w-full flex items-start gap-4">
          <input
            type="text"
            className="w-full border border-gray-400 rounded px-2 py-1 focus:outline-none"
            placeholder="Type a message..."
            value={newMessage || ""}
            onChange={(event) => {
              console.log(event.target.value);
              handleTyping(event);
            }}
          />
          <button className="px-2 py-1 rounded bg-violet-500 text-white hover:bg-violet-600 whitespace-nowrap">
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendMessageBox;
