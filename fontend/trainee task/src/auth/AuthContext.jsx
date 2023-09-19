import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "../api/axios";
import { TOKEN_URL } from "../api/Url";
import { auth } from "../utils/FireBase";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Custom hook for fetching user data
const useFetchUserData = () => {
  const [userData, setUserData] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const authToken = Cookies.get("authToken");
  const [userFirebase, setUserFirebase] = useState({});
  const fetchUserRole = async () => {
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
      } finally {
        setLoading(false); // Set loading to false after API call completes
      }
    } else {
      setUserData([]);
      setAuthenticated(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
    auth.onAuthStateChanged((user)=>{
      setUserFirebase(user)
      setLoading(false)
    })
  }, [userFirebase]);

  return { authenticated, userData, loading, authToken, userFirebase };
};

export const AuthProvider = ({ children }) => {
  const authData = useFetchUserData();
  if (authData.loading && authData.authToken) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};
