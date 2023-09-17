import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "../api/axios";
import { TOKEN_URL } from "../api/Url";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState("");  
  useEffect(() => {
    const fetchUserRole = async () => {
      const authToken = Cookies.get("authToken");      
      if (authToken) {
        const headers = {
          'Authorization': `${authToken}`
        }
        try {
          const response = await axios.get(TOKEN_URL, { headers });
          setRole(response.data); 
          setAuthenticated(true);
        } catch (error) {
          console.error(error);
          setRole('');
          setAuthenticated(false);
        }
      } else {
        setAuthenticated(false);
      }
    };
  
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, role }}>
      {children}
    </AuthContext.Provider>
  );
};
