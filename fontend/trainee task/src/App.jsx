import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./components/SginIn";
import SignUp from "./components/SginUp";
import Users from "./pages/Users";
import Home from "./pages/Home";
import { useAuth } from "./auth/AuthContext";
import Cookies from "js-cookie";
import UserPath from "./auth/UserPath";
import AdminPath from "./auth/AdminPath";

function App() {
  const authToken = Cookies.get("authToken");

  return (
    <BrowserRouter>
      <Routes>
        {authToken ? (
          <>
            <Route element={<UserPath />}>
              <Route path="/" element={<Home />} />
            </Route>

            <Route element={<AdminPath />}>
              <Route path="/" element={<Users />} />
            </Route>
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
