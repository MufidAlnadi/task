import React, { useEffect } from "react";
import { useFormik } from "formik";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router";
import { auth } from "../utils/FireBase";
import axios from "../api/axios";
import { signInWithEmailAndPassword } from "firebase/auth";

const defaultTheme = createTheme();

export default function SignIn() {
  const { userData } = useAuth(); // Assuming you have an authentication context

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      console.log("🚀 ~ file: SginIn.jsx:33 ~ onSubmit: ~ values:", values)
      try {
        const res = await axios.post("/user/login", values);
        const { token } = res.data;
        Cookies.set("authToken", token, { expires: 10 });
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast.success("User logged in", res.data);
        window.location.reload();
      } catch (error) {
        console.log("🚀 ~ file: SginIn.jsx:42 ~ onSubmit: ~ error:", error)
        if (error.response && error.response.status === 401) {
          toast.error(
            "This account is inactive, please wait for the admin to activate your account"
          );
        } else {
          if (error.code === "auth/user-not-found") {
            toast.error(
              "User not found. Please check your email and password."
            );
          } else if (error.code === "auth/wrong-password") {
            toast.error("Wrong password. Please check your password.");
          } else {
            toast.error(
              "An error occurred while logging in. Please try again later."
            );
          }
        }
      }
    },
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              {...formik.getFieldProps("email")}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...formik.getFieldProps("password")}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
