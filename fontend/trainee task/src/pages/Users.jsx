import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../components/SideBar";
import DataTable from "../components/DataTable";
import { FormatTime } from "../utils/FromatDate";
import { IconButton, TextField } from "@mui/material";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import toast from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomModal from "../components/modal/CustomModal";
import UserUpdateModal from "../components/modal/UserUpdateModal";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ConfirmationDialog from "../components/modal/ConfirmationDialog";
import CreateUser from "../components/modal/CreateUser";

const Users = () => {
  const [rows, setRows] = useState([]);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);
  const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false); // Add state for Create User modal


  useEffect(() => {
    axios
      .get("http://localhost:3100/user/getallusers")
      .then((response) => {
        setRows(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [rows]);

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
      const response = await axios.put("http://localhost:3100/user/update", {
        userId: row._id,
        username: row.username,
        email: row.email,
      });
      toast.success("User updated successfully:", response.data);
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
      const response = await axios.put(`http://localhost:3100/user/delete`, {
        userId: deleteUser._id,
        deleted: true,
      });
  
      toast.success("User deactivated successfully");
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Error updating user activation status");
    }
  };
  const handleDeleteCancelled = () => {
    setDeleteDialogOpen(false); 
  };
  const handleActivateUser = async (row) => {
    try {
      const response = await axios.put(`http://localhost:3100/user/activate`, {
        userId: row._id,
        activated: true,
      });
      toast.success("User activated successfully");
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
  const handleOpenCreateUserModal = () => {
    console.log("Open Create User Modal"); // Add this line for debugging
    setCreateUserModalOpen(true);
  };
  
  return (
    <>
      <SideBar title="Users" openModal={handleOpenCreateUserModal} />
      <CreateUser open={isCreateUserModalOpen} onClose={() => setCreateUserModalOpen(false)} /> {/* Render the Create User component */}
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
      >
        <UserUpdateModal
          selectedUser={selectedUser}
          onUpdate={handleUpdateUser}
          onClose={() => setUpdateModalOpen(false)}
        />
      </CustomModal>
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancelled}
        onConfirm={handleDeleteConfirmed}
        onCancel={handleDeleteCancelled}
        message="Are you sure you want to delete this user?"
      />
    </>
  );
};

export default Users;
