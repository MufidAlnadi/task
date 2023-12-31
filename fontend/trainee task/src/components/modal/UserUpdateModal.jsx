import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button, DialogActions } from "@mui/material";

const UserUpdateModal = ({ selectedUser, onUpdate, onClose }) => {
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  return (
    <Formik
      initialValues={{
        _id: selectedUser && selectedUser._id ? selectedUser._id : "", 
        username:
          selectedUser && selectedUser.username ? selectedUser.username : "",
        email: selectedUser && selectedUser.email ? selectedUser.email : "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onUpdate(values); 
        onClose(); 
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, errors }) => (
        <Form>
          <div>
            <Field
             sx={{ mt: 1 }}
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
             sx={{ mt: 2 }}
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
            <DialogActions>
              <Button color="primary" disabled={isSubmitting} type="submit">
                Submit
              </Button>
            </DialogActions>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UserUpdateModal;
