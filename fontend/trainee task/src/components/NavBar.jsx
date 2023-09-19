import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';
import { auth } from '../utils/FireBase';


const NavBar = (props) => {


  const handleButtonClick = async() => {
    Cookies.remove('authToken');
    await auth.signOut()
    window.location.reload(); 
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {props.title}
          </Typography>
          <Button color="inherit" onClick={handleButtonClick}>
            logOut
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
