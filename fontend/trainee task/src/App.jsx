import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./components/SginIn";
import SignUp from "./components/SginUp";
import Users from "./pages/Users";
import Home from "./pages/Home";
import { useAuth } from "./auth/AuthContext";
import Cookies from "js-cookie";

function App() {
  const { userData } = useAuth();
  const authToken = Cookies.get("authToken");

  return (
    <BrowserRouter>
      <Routes>
        {authToken ? (
          <>
            {userData[2]?.value === "user" ? (
              <>
              <Route path="/home" element={<Home />} />
              <Route path="/*" element={<Home />} />
                </>
            ) : (
              <>
              <Route path="/users" element={<Users />} />
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
