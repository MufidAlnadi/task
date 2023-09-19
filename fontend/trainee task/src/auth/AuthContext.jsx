import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "../api/axios";
import { TOKEN_URL } from "../api/Url";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Custom hook for fetching user data
const useFetchUserData = () => {
  const [userData, setUserData] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);

  const fetchUserRole = async () => {
    const authToken = Cookies.get("authToken");
    if (authToken) {
      const headers = {
        Authorization: `${authToken}`,
      };
      try {
        const response = await axios.get(TOKEN_URL, { headers });
        setUserData(response.data.user);
        setAuthenticated(true);
      } catch (error) {
        console.error(error);
        setUserData([]);
        setAuthenticated(false);
      }
    } else {
      setUserData([]);
      setAuthenticated(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  return { authenticated, userData, fetchUserRole }; // Return the userData and a function to manually trigger fetching
};

export const AuthProvider = ({ children }) => {
  const authData = useFetchUserData();

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};
