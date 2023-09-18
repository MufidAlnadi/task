import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { DialogTitle } from "@mui/material";
function CustomModal({ open, onClose, children , title}) {
  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} sx={{ "& .MuiDialog-paper": { width: "60%", maxWidth: "none" } }}>
           <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default CustomModal;
