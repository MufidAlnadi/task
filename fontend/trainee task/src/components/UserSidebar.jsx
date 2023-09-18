import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SubjectIcon from '@mui/icons-material/Subject';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import React from "react";
import { useNavigate } from "react-router-dom";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Grid } from "@mui/material";

const drawerWidth = 240;

export default function UserSidebar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const texts = [{ title: "Users", value: "users" }];
  const icons = [<AccountCircleIcon key="users" />];
  const drawer = (
    <Box>
      <Toolbar />
      <List sx={{ pt: "1rem" }}>
        {texts.map((item, index) => (
          <ListItem key={item.value} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(`/${item.value}`);
              }}
            >
              <ListItemIcon>{icons[index]}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                display: { sm: "none" },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {props.title}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="add user"
              onClick={props.openCreateUser}
              sx={{mr: 6}}
            >
              <Grid container direction="column" alignItems="center">
                <Grid item>
                  <AccountCircleIcon fontSize="large" />
                </Grid>
                <Grid item>
                  <Typography variant="body2">Add User</Typography>
                </Grid>
              </Grid>
            </IconButton>

            <IconButton
              color="inherit"
              aria-label="add Subject"
              onClick={props.openAddSubject}
              sx={{mr: 6}}
            >
              <Grid container direction="column" alignItems="center">
                <Grid item>
                  <SubjectIcon fontSize="large" />
                </Grid>
                <Grid item>
                  <Typography variant="body2">Add Subject</Typography>
                </Grid>
              </Grid>
            </IconButton>

            <IconButton
              color="inherit"
              aria-label="add Assign Student Subject"
              onClick={props.openAssignStudentSubject}
              sx={{mr: 6}}

            >
              <Grid container direction="column" alignItems="center">
                <Grid item>
                  <AssignmentIcon fontSize="large" />
                </Grid>
                <Grid item>
                  <Typography variant="body2">Assign Subject</Typography>
                </Grid>
              </Grid>
            </IconButton>

            <IconButton
              color="inherit"
              aria-label="Set Student Mark"
            >
              onClick={props.openAssignStudentMark}
              <Grid container direction="column" alignItems="center">
                <Grid item>
                  <BorderColorIcon fontSize="large" />
                </Grid>
                <Grid item>
                  <Typography variant="body2">Set Mark</Typography>
                </Grid>
              </Grid>
            </IconButton>
          
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          position: "fixed",
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: {
              xs: "block",
              sm: "none",
            },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
