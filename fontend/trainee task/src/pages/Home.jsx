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
import { useAuth } from "../auth/AuthContext";
import Cookies from "js-cookie";
import axios from "../api/axios";
import SubjectTable from "../components/tables/SubjectTable";
import NavBar from "../components/NavBar";

const UserTable = () => {
  const { userData } = useAuth();

  if (userData.length === 0) {
    return <div>No user data available.</div>;
  }
  const userDataToRender = userData.slice(0, userData.length - 2);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {userDataToRender.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.key}</TableCell>
              <TableCell>{item.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};


const Home = () => {
  return (
    <>
    <NavBar title ="info"/>
      <h2>User Data Table</h2>
      <UserTable />
      <h2>Subject Data Table</h2>
      <SubjectTable/>
    </>
  );
};

export default Home;
