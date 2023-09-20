import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./components/SginIn";
import SignUp from "./components/SginUp";
import Users from "./pages/Users";
import Home from "./pages/Home";
import { useAuth } from "./auth/AuthContext";
import Cookies from "js-cookie";
import { useState } from "react";
import Chat from "./pages/Chat";
import ChatAdmin from "./pages/ChatAdmin";

function App() {
  const { userData } = useAuth();
  const [authToken, setAuthToken] = useState(Cookies.get("authToken"));

  return (
    <BrowserRouter>
      <Routes>
        {authToken ? (
          <>
            {userData[2]?.value === "user" ? (
              <>
                <Route path="/home" element={<Home />} />
                <Route path="/*" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
              </>
            ) : (
              <>
                <Route path="/users" element={<Users />} />
                <Route path="/adminchat" element={<ChatAdmin />} />
                <Route path="/*" element={<Users />} />
              </>
            )}
          </>
        ) : (
          <>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<SignIn />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
