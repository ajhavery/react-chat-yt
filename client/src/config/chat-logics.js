// if not a group chat, it will have only 2 users in the users array
export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

// Get full details including name and avatar of the sender
export const getSenderDetails = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

// We need to display sender name only at the last message
export const isSameSender = (messages, message, index, loggedInuserId) => {
  return (
    index < messages.length - 1 &&
    (messages[index + 1].sender._id !== message.sender._id ||
      messages[index + 1].sender._id === undefined) &&
    messages[index].sender._id !== loggedInuserId
  );
};

export const isLastMessage = (messages, index, loggedInuserId) => {
  return (
    index === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== loggedInuserId &&
    messages[messages.length - 1].sender._id
  );
};
