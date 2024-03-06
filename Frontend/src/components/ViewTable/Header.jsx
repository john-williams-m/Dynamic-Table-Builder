import { Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { json, useNavigate, useParams, useSubmit } from "react-router-dom";

function Header({ name, handleTableNameChange }) {
  const nonMobileScreenSize = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const { table_name } = useParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const submit = useSubmit();
  const handleDialogClose = () => setDialogOpen(false);
  const handleDialogOpen = () => setDialogOpen(true);
  const handleTableEdit = () => {
    handleDialogOpen();
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const new_name = formJson.new_name;
    const body = { new_name };
    const response = await fetch(
      `${import.meta.env.VITE_REACT_API_BACKEND_URL}/api/tables/${table_name}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw json({ message: "Could not rename table" }, { status: 500 });
    }
    handleTableNameChange(new_name);
    handleDialogClose();
    navigate(`/tables/${new_name}`);
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
        <DialogTitle>Edit Table Name</DialogTitle>
        <DialogContent>
          <DialogContentText textTransform={"capitalize"}>
            Old Name: {name}
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="new_name"
            name="new_name"
            label="New Table Name"
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
      <Box
        m={3}
        sx={{
          display: "flex",
          flexDirection: nonMobileScreenSize ? "row" : "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          textTransform={"capitalize"}
          sx={{
            fontSize: nonMobileScreenSize ? "1.5rem" : "1.25rem",
          }}
        >
          Name: {name}
        </Typography>
        <Box display={"flex"} gap={2}>
          <Button
            size="large"
            startIcon={<Edit />}
            variant="outlined"
            onClick={handleTableEdit}
          >
            Edit
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default Header;
