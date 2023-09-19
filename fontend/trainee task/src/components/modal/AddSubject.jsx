import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button, DialogActions } from "@mui/material";
import CustomModal from "./CustomModal";
import toast from "react-hot-toast";
import { ADD_SUBJECT_URL } from "../../api/Url";
import axios from "../../api/axios";

function AddSubject({ open, onClose }) {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    minMarks: Yup.number()
      .required("Minimum Marks is required")
      .positive("Minimum Marks must be a positive number"),
  });

  const addSubject = async (formData, { resetForm }) => {
    console.log(
      "🚀 ~ file: AddSubject.jsx:19 ~ addSubject ~ formData:",
      formData
    );
    try {
      const response = await axios.post(ADD_SUBJECT_URL, formData);
      toast.success("Subject added successfully", response.data);
      resetForm();
      onClose();
    } catch (error) {
      toast.error("Subject addition failed", error);
    }
  };
  useEffect(() => {
    addSubject();
  }, []);
  return (
    <CustomModal open={open} onClose={onClose} title="Add Subject">
      <Formik
        initialValues={{
          name: "",
          minMarks: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          addSubject(values, { resetForm });
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <div>
              <Field
                sx={{ pt: "10px" }}
                as={TextField}
                type="text"
                name="name"
                label="Name"
                variant="outlined"
                fullWidth
                error={Boolean(errors.name)}
                helperText={<ErrorMessage name="name" />}
              />
            </div>
            <div>
              <Field
                sx={{ pt: "10px" }}
                as={TextField}
                type="number"
                name="minMarks"
                label="Minimum Marks"
                variant="outlined"
                fullWidth
                error={Boolean(errors.minMarks)}
                helperText={<ErrorMessage name="minMarks" />}
              />
            </div>
            <div>
              <DialogActions>
                <Button color="primary" disabled={isSubmitting} type="submit">
                  Add Subject
                </Button>
              </DialogActions>
            </div>
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
}

export default AddSubject;
