import React, { useEffect, useState } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import axios from "../../api/axios";


const SubjectTable = () => {
  const { userData } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const userIdValue = userData[3]?.value;

  const fetchSubjects = () => {
    axios
      .get(`/subjects/getstudentsubjects/${userIdValue}`)
      .then((response) => {
        setSubjects(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchMarks = () => {
    const markPromises = subjects.map((subject) => {
      return axios
        .get(`/marks/getmarks/${userIdValue}/${subject?._id}`)
        .then((response) =>
        response.data)
        .catch((error) => {
          console.error("Error fetching marks:", error);
          return { subjectId: subject._id, Marks: "N/A" };
        });
    });
    console.log("🚀 ~ file: SubjectTable.jsx:42 ~ markPromises ~ markPromises:", markPromises)

    Promise.all(markPromises)
      .then((markData) => {
        setMarks(markData);
      })
      .catch((error) => {
        console.error("Error fetching marks:", error);
      });
  };

  useEffect(() => {
    fetchSubjects();
  }, [userIdValue]);

  useEffect(() => {
    if (subjects.length > 0) {
      fetchMarks();
    }
  }, [subjects]);

  if (subjects.length === 0) {
    return <div>No subjects available.</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Subject</TableCell>
            <TableCell>Pass Mark</TableCell>
            <TableCell>Student Mark</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subjects.map((subject, index) => (
            <TableRow key={index}>
              <TableCell>{subject.name}</TableCell>
              <TableCell>{subject.minMarks}</TableCell>
              <TableCell>
                {marks.length > 0
                  ? marks[index]?.mark || "N/A"
                  : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SubjectTable;
