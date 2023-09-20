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
  Input,
} from "@mui/material";

import { GETUSERS_URL } from "../../api/Url";
import toast from "react-hot-toast";

const AssignmentMarksModal = ({ open, onClose }) => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [mark, setMark] = useState(0);

  const fetchUsers = () => {
    axios
      .get(GETUSERS_URL)
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  };
  const fetchSubjects = () => {
    axios
      .get(`/subjects/getstudentsubjects/${selectedStudent}`)
      .then((response) => {
        setSubjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  };
  const getSubjectMark = () => {
    axios
      .get(`/marks/getmarks/${selectedStudent}/${selectedSubject}`)
      .then((response) => {
        setMark(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  };
  useEffect(() => {
    fetchUsers();
    fetchSubjects();
    getSubjectMark();
  }, [selectedStudent]);
  const postMarks = async (userId, subjectId, marks) => {
    try {
      const response = await axios.post("/marks/postmark", {
        userId,
        subjectId,
        marks,
      });

      if (response.status === 201) {
        toast.success("Marks posted successfully");
        setSelectedStudent('')
        setMark(0)
        setSelectedSubject('')
        onClose();
      } else {
        toast.error("Failed to post marks");
        // Handle error, e.g., show an error message
      }
    } catch (error) {
      toast.error("Error posting marks:", error);
      // Handle error, e.g., show an error message
    }
  };
  const handleAssignMark = () => {
    if (!selectedSubject || !mark) {
      toast.error("Please select a subject and enter a mark.");
      return;
    }

    const userId = selectedStudent;
    const subjectId = selectedSubject;
    const marks = mark;

    postMarks(userId, subjectId, marks);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setSelectedStudent("");
        setSelectedSubject("");
        setMark("");
        onClose();
      }}
      sx={{ "& .MuiDialog-paper": { width: "60%", maxWidth: "none" } }}
    >
      <DialogTitle>Assign Mark to Subject</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 1 }}>
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

        <FormControl fullWidth sx={{ mt: 1 }}>
          <InputLabel id="subjects">Subjects</InputLabel>
          <Select
            labelId="subjects"
            id="subjects"
            value={selectedSubject}
            label="Subjects"
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {subjects.map(({ _id, name }, index) => (
              <MenuItem key={index} value={_id}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 1, width: "70%" }}>
          <InputLabel>Mark</InputLabel>
          <Input
            type="number"
            value={mark}
            sx={{ pl: 2 }}
            onChange={(e) => setMark(e.target.value)}
          />
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleAssignMark}
          color="primary"
          variant="contained"
          disabled={!selectedSubject || !mark}
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignmentMarksModal;
