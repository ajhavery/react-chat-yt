import { useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import { ChatState } from "../../contexts/ChatProvider";
import ReactTooltip from "react-tooltip";
import Lottie from "react-lottie";
import typingAnimation from "../../animation/typing-indicator.json";

const SingleChatDisplay = ({
  rerender,
  setRerender,
  loading,
  messages,
  isTyping,
}) => {
  const { user } = ChatState();

  // console.log(messages);

  // scroll to bottom on receiving a new message
  const chatRef = useRef();

  useEffect(() => {
    chatRef.current.scrollIntoView();
  }, [messages, isTyping]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: typingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="max-h-full">
      {loading ? (
        <Skeleton count={5} />
      ) : (
        <div className="flex flex-col py-4 space-y-2">
          {messages &&
            messages.map((message, index) => (
              <div key={index} className={`flex items-end gap-2`}>
                {(messages[index + 1] === undefined ||
                  messages[index + 1]?.sender?._id !== message?.sender?._id) &&
                messages[index]?.sender?._id !== user?._id ? (
                  <div className="w-10">
                    <ReactTooltip />
                    <p data-tip={message?.sender?.name}>
                      <img
                        src={message?.sender?.avatar}
                        alt={message?.sender?.name || "user"}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </p>
                  </div>
                ) : (
                  <div className="w-10"></div>
                )}
                <div className="w-full">
                  <div
                    className={`rounded-lg px-2 py-1 max-w-4xl ${
                      message?.sender?._id === user?._id
                        ? "bg-[#BEE3F8] float-right"
                        : "bg-[#B9F5D0] float-left"
                    }`}
                  >
                    {message?.content}
                  </div>
                </div>
              </div>
            ))}
          {isTyping && (
            <div>
              <Lottie
                options={defaultOptions}
                width={70}
                style={{ marginBottom: 15, marginLeft: 0 }}
              />
            </div>
          )}
          <div ref={chatRef} />
        </div>
      )}
    </div>
  );
};

export default SingleChatDisplay;
