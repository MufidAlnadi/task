import React from "react";
import ChatUI from "../components/chat/ChatBox";
import NavBar from "../components/NavBar";

export default function Chat() {
    
  return (
    <div>
      <NavBar title="Student Chat" />
      <ChatUI username="name"/>
    </div>
  );
}
