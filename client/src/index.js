import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
// react toastify import
import "react-toastify/dist/ReactToastify.css";
// react loadign skeleton css
import "react-loading-skeleton/dist/skeleton.css";
// context provider
import ChatProvider from "./contexts/ChatProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChatProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ChatProvider>
);
