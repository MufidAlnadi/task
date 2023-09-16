import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios"; // Don't forget to import axios

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  console.log("🚀 ~ file: AuthContext.jsx:14 ~ AuthProvider ~ role:", role)
  
  useEffect(() => {
    const fetchUserRole = async () => {
      const authToken = Cookies.get("authToken");      
      if (authToken) {
        const headers = {
          'Authorization': `${authToken}`
        }
        try {
          const response = await axios.get("http://localhost:3100/token/decode-token", { headers });
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

    fetchUserRole();
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, role }}>
      {children}
    </AuthContext.Provider>
  );
};
