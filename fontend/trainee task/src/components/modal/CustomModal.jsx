import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
function CustomModal({ open, onClose, children }) {
  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} sx={{ "& .MuiDialog-paper": { width: "60%", maxWidth: "none" } }}>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default CustomModal;
