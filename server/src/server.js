require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const colors = require("colors");
const databaseConnect = require("../config/database");

// Importing routes
const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");
const messageRoutes = require("./routes/message.routes");
const notFound = require("./middlewares/not-found");
const errorHandler = require("./middlewares/error-handler");

// Connect to database
databaseConnect();

// app.use(morgan());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
// app.use("/", (req, res) =>
//   res.send({ success: true, message: "route working properly" })
// );
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server listening on port: ${PORT}`)
);

/***********************************************************
 ****************** SOCKET IO CONNECTION ******************
 ***********************************************************/

const socket = require("socket.io");

const io = socket(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

// Establishing socket connection
// socket.on = listen to events
// socket.emit = emit events
io.on("connection", (socket) => {
  console.log("Connected to socket io");

  // create a personal room for the user with his _id [here user = sender]
  socket.on("setup", (userData) => {
    socket.join(userData?._id);
    console.log(userData?._id);
    socket.emit("connected");
  });

  // when we click on a chat, it should add that user to the room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room " + room);
  });

  // handle typing state
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // every user creates a room with his user._id
  // emit the message in all rooms which are part of the chat
  socket.on("new message", (message) => {
    var chat = message.chat;
    if (!chat?.users) {
      return console.log("chat.users not defined");
    }
    // new message should be received by all other users of the group
    chat.users.forEach((user) => {
      if (user._id === message.sender._id) return; // do not emit to sender
      socket.in(user._id).emit("message received", message);
    });
  });

  // Closing the socket
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData?._id);
  });
});
