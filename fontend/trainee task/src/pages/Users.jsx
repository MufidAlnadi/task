import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import SideBar from "../components/SideBar";
import DataTable from "../components/DataTable";
import { IconButton } from "@mui/material";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import toast from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomModal from "../components/modal/CustomModal";
import UserUpdateModal from "../components/modal/UserUpdateModal";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ConfirmationDialog from "../components/modal/ConfirmationDialog";
import CreateUser from "../components/modal/CreateUser";
import { ACTIVE_URL, DELETE_URL, GETUSERS_URL, UPDATE_URL } from "../api/Url";
import AddSubject from "../components/modal/AddSubject";
import AssignmentModal from "../components/modal/AssignStudentSubject";

const Users = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isAssignStudentSubject, setAssignStudentSubject] = useState(false);

  const [rows, setRows] = useState([]);
  const fetchData = () => {
    axios
      .get(GETUSERS_URL)
      .then((response) => {
        setRows(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleUpdateClick = (row) => {
    if (row && row._id) {
      setSelectedUser(row);
      setUpdateModalOpen(true);
    } else {
      console.error("Invalid user data:", row);
    }
  };

  const handleUpdateUser = async (row) => {
    try {
      const response = await axios.put(UPDATE_URL, {
        userId: row._id,
        username: row.username,
        email: row.email,
      });
      toast.success("User updated successfully:", response.data);
      fetchData();
    } catch (error) {
      toast.error("Error updating user:", error);
    }
  };
  const handleDeleteClick = (row) => {
    setDeleteUser(row);
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirmed = async () => {
    try {
      const response = await axios.put(DELETE_URL, {
        userId: deleteUser._id,
        deleted: true,
      });

      toast.success("User deactivated successfully");
      setDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Error updating user activation status");
    }
  };
  const handleActivateUser = async (row) => {
    try {
      const response = await axios.put(ACTIVE_URL, {
        userId: row._id,
        activated: true,
      });
      toast.success("User activated successfully");
      fetchData();
    } catch (error) {
      toast.error("Error updating user activation status");
    }
  };

  const columns = [
    {
      field: "username",
      headerName: "Username",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "activated",
      headerName: "Activated",
      width: 120,
      valueFormatter: (params) => (params.value ? "Yes" : "No"),
    },
    {
      field: "updateButton",
      headerName: "Update",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleUpdateClick(params.row)}
        >
          <CreditScoreIcon />
        </IconButton>
      ),
    },
    {
      field: "activateButton",
      headerName: "Activate",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleActivateUser(params.row)}
        >
          <TaskAltIcon />
        </IconButton>
      ),
    },
    {
      field: "deleteButton",
      headerName: "Delete",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => handleDeleteClick(params.row)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];
  const filteredRows = rows.filter((user) => !user.deleted);
  return (
    <>
      <SideBar title="Dashboard" openCreateUser={() => setCreateUserModalOpen(true)} 
       openAddSubject ={()=>setIsAddSubjectOpen(true)}
       openAssignStudentSubject ={()=>setAssignStudentSubject(true)}
      />
      <CreateUser
        open={isCreateUserModalOpen}
        onClose={() => setCreateUserModalOpen(false)}
      />
      <AddSubject
        open={isAddSubjectOpen}
        onClose={() => setIsAddSubjectOpen(false)}
      />
      <AssignmentModal
          open={isAssignStudentSubject}
          onClose={() => setAssignStudentSubject(false)}
      />
      <DataTable
        columns={columns}
        rows={filteredRows}
        getRowId={(row) => row._id}
        searchable={false}
      />
      <CustomModal
        open={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onUpdate={handleUpdateUser}
        title="Update User"
        
      >
        <UserUpdateModal
          selectedUser={selectedUser}
          onUpdate={handleUpdateUser}
          onClose={() => setUpdateModalOpen(false)}
        />
      </CustomModal>
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteDialogOpen(false)}
        message="Are you sure you want to delete this user?"
      />
    </>
  );
};

export default Users;
