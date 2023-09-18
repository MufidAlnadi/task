import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button, DialogActions } from "@mui/material";
import CustomModal from "./CustomModal";
import toast from "react-hot-toast";
import { SINGUP_URL } from "../../api/Url";
import axios from "../../api/axios";

function CreateUser({ open, onClose }) {
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });
  useEffect(() => {
    createUser();
  }, [])
  const createUser = async (formData, { resetForm }) => {
    try {
      const response = await axios.post(SINGUP_URL, formData);
      toast.success("User created successfully", response.data);
      resetForm();
      onClose(); 
    } catch (error) {
      toast.error("User exists already", error);
    }
  };

  return (
    <CustomModal open={open} onClose={onClose} title="Create User">
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => { 
          createUser(values, { resetForm });
          setSubmitting(false);
        }}
        
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <div>
              <Field
              sx={{pt: "10px"}}
                as={TextField}
                type="text"
                name="username"
                label="Username"
                variant="outlined"
                fullWidth
                error={Boolean(errors.username)}
                helperText={<ErrorMessage name="username" />}
              />
            </div>
            <div>
              <Field
                sx={{pt: "10px"}}
                as={TextField}
                type="email"
                name="email"
                label="Email"
                variant="outlined"
                fullWidth
                error={Boolean(errors.email)}
                helperText={<ErrorMessage name="email" />}
              />
            </div>
            <div>
              <Field
                sx={{pt: "10px"}}
                as={TextField}
                type="password"
                name="password"
                label="Password"
                variant="outlined"
                fullWidth
                error={Boolean(errors.password)}
                helperText={<ErrorMessage name="password" />}
              />
            </div>
            <div>
              <DialogActions>
                <Button color="primary" disabled={isSubmitting} type="submit">
                  Create User
                </Button>
              </DialogActions>
            </div>
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
}

export default CreateUser;
