import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./components/SginIn";
import SignUp from "./components/SginUp";
import Users from "./pages/Users";
import Home from "./pages/Home";
import { useAuth } from "./auth/AuthContext";

function App() {
  const { authenticated } = useAuth();
  const { role } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* {authenticated ? ( */}
          <>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
            <Route path="/users" element={<Users/>} />
            <Route path="*" element={<Navigate to="/users" />} />
          </>
        {/* // ) : ( */}
          <>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<SignIn />} />
          </>
        {/* )} */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
