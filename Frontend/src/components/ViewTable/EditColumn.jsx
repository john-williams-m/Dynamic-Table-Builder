import { Edit } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { useSubmit } from "react-router-dom";

function EditColumn({ column_name }) {
  const nonMobileScreenSize = useMediaQuery("(min-width:600px)");
  const [dialogOpen, setDialogOpen] = useState(false);
  const submit = useSubmit();
  const handleDialogClose = () => setDialogOpen(false);
  const handleDialogOpen = () => setDialogOpen(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const new_name = formJson.new_name;
    handleDialogClose();
    submit(
      { new_column_name: new_name, old_column_name: column_name },
      { method: "PATCH" }
    );
  };

  const handleEdit = () => {
    handleDialogOpen();
  };

  return (
    <>
      <Dialog
        open={dialogOpen}
        fullWidth
        onClose={handleDialogClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Edit Column Name</DialogTitle>
        <DialogContent>
          <DialogContentText textTransform={"capitalize"}>
            Old Name: {column_name}
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="new_name"
            name="new_name"
            label="New Column Name"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleDialogClose}>
            Close
          </Button>
          <Button variant="contained" type="submit">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      {!nonMobileScreenSize && (
        <IconButton onClick={() => handleEdit()}>
          <Edit color="info" />
        </IconButton>
      )}
      {nonMobileScreenSize && (
        <Button
          variant="contained"
          color="info"
          onClick={() => handleEdit()}
          endIcon={<Edit />}
        >
          Edit
        </Button>
      )}
    </>
  );
}

export default EditColumn;
