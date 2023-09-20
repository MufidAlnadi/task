import React from "react";
import ChatUI from "../components/chat/ChatBox";
import NavBar from "../components/NavBar";
import LayoutChat from "../components/chat/LayoutChat";

export default function Chat() {
    
  return (
    <div>
      <NavBar title="Student Chat" />
      <LayoutChat/>
    </div>
  );
}
