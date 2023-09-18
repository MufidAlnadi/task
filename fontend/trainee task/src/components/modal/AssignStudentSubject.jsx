import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

import { ALL_SUBJECTS_URL, ASSIGN_SUBJECTS_URL } from "../../api/Url";
import toast from "react-hot-toast";

const AssignmentModal = ({ open, onClose }) => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(""); 
  const [selectedSubject, setSelectedSubject] = useState(""); 

  useEffect(() => {
    axios
      .get(ALL_SUBJECTS_URL)
      .then((response) => {
        const filteredSubjects = response.data.reduce((uniqueSubjects, subject) => {
          if (!uniqueSubjects.find((item) => item.name === subject.name)) {
            uniqueSubjects.push(subject);
          }
          return uniqueSubjects;
        }, []);

        setSubjects(filteredSubjects);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  }, []);

  const fetchstudents = () => {
    if (!selectedSubject) {
      setStudents([])
      return;
    }
    axios
      .get(`/subjects/getsubjectsstudent/${selectedSubject}`)
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students without subjects:", error);
      })
  };

  useEffect(() => {
    fetchstudents();
  
  }, []);

  const handleAssignSubject = () => {
    axios
      .post(ASSIGN_SUBJECTS_URL, {
        userId: selectedStudent,
        subjectId: selectedSubject,
      })
      .then((response) => {
        toast.success("Subject assigned successfully:", response.data);
        setSelectedStudent('')
        setSelectedSubject('')
        onClose();
      })
      .catch((error) => {
        toast.error("Error assigning subject:", error);
      });
  };
  const handleChangeSubject = (event) => {
    setSelectedSubject(event.target.value);
    setSelectedStudent('');
    fetchstudents();
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        setSelectedSubject("");
        setSelectedStudent("");
        onClose();
      }}
      sx={{ "& .MuiDialog-paper": { width: "60%", maxWidth: "none" } }}
    >
      <DialogTitle>Assign Subject to Student</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 1 }}>
          <InputLabel id="subjects">Subjects</InputLabel>
          <Select
            labelId="subjects"
            id="subjects"
            value={selectedSubject}
            label="Subjects"
            onChange={handleChangeSubject}
          >
            {subjects.map(({ name, _id }, index) => (
              <MenuItem key={index} value={_id}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 1}}>
          <InputLabel>Student</InputLabel>
          <Select
            labelId="student"
            id="student"
            label="Student"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            {students.map(({ username, _id }, index) => (
              <MenuItem key={index} value={_id}>
                {username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleAssignSubject}
          color="primary"
          variant="contained"
          disabled={!selectedStudent || !selectedSubject}
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignmentModal;
