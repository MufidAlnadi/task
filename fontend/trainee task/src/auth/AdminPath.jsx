import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AdminPath() {
  const { userData } = useAuth();

  return userData[2]?.value === "admin" ? <Outlet /> : <Navigate to="/" />;
}
