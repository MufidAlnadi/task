import React from "react";
import AdminLayoutChat from "../components/chat/AdminLayoutChat";
import NavBar from "../components/NavBar";

export default function ChatAdmin() {
  return (
    <div>
      <NavBar title="Admin Chat" />
      <AdminLayoutChat />
    </div>
  );
}
