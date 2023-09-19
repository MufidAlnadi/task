import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthContext";

export default function UserPath() {
  const { userData } = useAuth();

  return userData[2]?.value === "user" ? <Outlet /> : <Navigate to="/" />;
}
