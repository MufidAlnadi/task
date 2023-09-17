import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { ALL_SUBJECTS_URL, ASSIGN_SUBJECTS_URL } from "../../api/Url";
import toast from "react-hot-toast";

const AssignmentModal = ({ open, onClose }) => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(""); // Initialize with default value
  const [selectedSubject, setSelectedSubject] = useState(""); // Initialize with default value
  console.log("🚀 ~ file: AssignStudentSubject.jsx:21 ~ AssignmentModal ~ selectedSubject:", selectedSubject)

  useEffect(() => {
    // Fetch all subjects from API
    axios
      .get(ALL_SUBJECTS_URL)
      .then((response) => {
        setSubjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  }, []);

//   useEffect(() => {
//     // Fetch students when subject selection changes
//     axios
//       .get(`/subjects/getsubjectsstudent/${selectedSubject}`)
//       .then((response) => {
//         setStudents(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching students without subjects:", error);
//       });
//   }, [selectedSubject]);

//   const handleAssignSubject = () => {
//     // Send a POST request to assign the subject to the student
//     axios
//       .post(ASSIGN_SUBJECTS_URL, {
//         studentId: selectedStudent,
//         subjectId: selectedSubject,
//       })
//       .then((response) => {
//         toast.success("Subject assigned successfully:", response.data);
//         onClose();
//       })
//       .catch((error) => {
//         toast.error("Error assigning subject:", error);
//       });
//   };
const handleChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ "& .MuiDialog-paper": { width: "60%", maxWidth: "none" } }}>
      <DialogTitle>Assign Subject to Student</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>Subject</InputLabel>
          <Select
            label="SelectedSubject"
            value={selectedSubject}
            onChange={handleChange}
          >
            {subjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>
                {subject.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ pt: "10px" }}>
          <InputLabel>Student</InputLabel>
          <Select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <MenuItem value="">Select a student</MenuItem> {/* Add an initial "Select" option */}
            {students.map((student) => (
              <MenuItem key={student.id} value={student.id}>
                {student.name}
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
