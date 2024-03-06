import React, { useState } from "react";
import AddColumnForm from "./ViewTable/AddColumnForm";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import { useSubmit } from "react-router-dom";
import { Add, Delete } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)({
  fontWeight: "800",
  fontSize: "1.15rem",
  textAlign: "center",
});

function TableCreation() {
  const nonMobileScreenSize = useMediaQuery("(min-width:600px)");
  const [showSnackbar, setShowSnackBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const submit = useSubmit();
  const handleDialogClose = () => setDialogOpen(false);
  const handleDialogOpen = () => setDialogOpen(true);
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState([]);

  const handleAddColumn = (columnData) => {
    setColumns([...columns, columnData]);
  };

  const handleDeleteColumn = (index) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const tableData = { table_name: tableName, columns };
    if (
      tableData.table_name.trim().length === 0 ||
      tableData.table_name.split(/\s+/).length > 1
    ) {
      setShowSnackBar(true);
      setErrorMessage("Invalid table name");
      return;
    }
    submit({ tableData: JSON.stringify(tableData) }, { method: "post" });
  };

  const handleSnackBarClose = () => {
    setShowSnackBar(false);
    setErrorMessage(null);
  };

  return (
    <>
      <Dialog open={dialogOpen} fullWidth onClose={handleDialogClose}>
        <DialogTitle>Add Column</DialogTitle>
        <DialogContent>
          <AddColumnForm
            onAddColumn={handleAddColumn}
            closeDialog={handleDialogClose}
          />
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={5000}
        onClose={handleSnackBarClose}
        message={errorMessage}
      />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          margin: "2rem 0rem",
        }}
      >
        <form
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            display={"flex"}
            gap={3}
            alignItems={"center"}
            marginBottom={2}
            flexDirection={nonMobileScreenSize ? "row" : "column"}
          >
            <Typography variant="h5">Table Name:</Typography>
            <TextField
              type="text"
              label="Table Name"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              required
            />
          </Box>
          {columns.length === 0 && (
            <Box marginBottom={2}>
              <Typography variant="h6">
                Add a column to start defining your table structure{" "}
              </Typography>
            </Box>
          )}
          <Button
            variant="contained"
            color="info"
            endIcon={<Add />}
            onClick={() => handleDialogOpen()}
          >
            Add Column
          </Button>
          {columns.length > 0 && (
            <TableContainer
              sx={{
                display: "flex",
                justifyContent: "center",
                margin: "1rem 0rem",
              }}
            >
              <Table
                sx={{
                  width: "700px",
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      fontWeight: "900",
                      bgcolor: "aqua",
                    }}
                  >
                    <StyledTableCell align="center">S No</StyledTableCell>
                    <StyledTableCell align="center">
                      Column Name
                    </StyledTableCell>
                    <StyledTableCell align="center">Data Type</StyledTableCell>
                    <StyledTableCell align="center">
                      Foreign Key
                    </StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {columns.map((column, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{column.column_name}</TableCell>
                      <TableCell align="center">{column.data_type}</TableCell>
                      <TableCell align="center">
                        {column.foreign_keys.length === 0 && (
                          <Typography>-</Typography>
                        )}
                        {column.foreign_keys
                          .map(
                            (fk) =>
                              fk.referenced_table_name +
                              "." +
                              fk.referenced_column_name
                          )
                          .join(", ")}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="error"
                          endIcon={<Delete />}
                          onClick={() => handleDeleteColumn(index)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              m: "1rem",
            }}
          >
            <Button
              variant="contained"
              type="submit"
              color="success"
              onClick={handleSubmit}
              sx={{
                marginRight: "1rem",
              }}
            >
              Create Table
            </Button>
          </Box>
        </form>
      </Container>
    </>
  );
}

export default TableCreation;
