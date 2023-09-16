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
    import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
    import AddBusinessIcon from "@mui/icons-material/AddBusiness";
    import ContactMailIcon from "@mui/icons-material/ContactMail";
    import AccountCircleIcon from "@mui/icons-material/AccountCircle";
    import React from "react";
    import { useNavigate } from "react-router-dom";
    import AddIcon from "@mui/icons-material/Add";

    const drawerWidth = 240;

    export default function SideBar(props) {
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
            <IconButton
                color="inherit"
                aria-label="add user"
                onClick={props.openModal}
                sx={{ mr: 2 }}
            >
                <AddIcon fontSize="large" />
            </IconButton>
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
