import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { useSubmit } from "react-router-dom";
import AddColumnForm from "./AddColumnForm";

const FlexBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

function AddColumnSection({ tableName }) {
  const nonMobileScreenSize = useMediaQuery("(min-width:600px)");
  const [dialogOpen, setDialogOpen] = useState(false);
  const submit = useSubmit();
  const handleDialogClose = () => setDialogOpen(false);
  const handleDialogOpen = () => setDialogOpen(true);

  const handleAddColumnSubmit = (columnData) => {
    submit({ columnData: JSON.stringify(columnData) }, { method: "post" });
  };

  const handleAddColumn = () => {
    handleDialogOpen();
  };

  return (
    <>
      <Dialog open={dialogOpen} fullWidth onClose={handleDialogClose}>
        <DialogTitle>Add Column</DialogTitle>
        <DialogContent>
          <AddColumnForm
            tableName={tableName}
            onAddColumn={handleAddColumnSubmit}
            closeDialog={handleDialogClose}
          />
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
      <FlexBox
        gap={3}
        sx={{
          flexDirection: nonMobileScreenSize ? "row" : "column",
        }}
      >
        <Typography variant="body1">
          Would you like to Add new column?
        </Typography>
        <Button variant="contained" onClick={handleAddColumn} endIcon={<Add />}>
          Add New Column
        </Button>
      </FlexBox>
    </>
  );
}

export default AddColumnSection;
