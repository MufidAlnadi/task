import { useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";

const Layout = ({ children }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        pl: isSmallScreen ? "0" : "15rem",
        pt: isSmallScreen ? "3rem" : "3.8rem",
      }}
    >
      {children}
    </Box>
  );
};

export default Layout;
