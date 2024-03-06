import { Delete } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import { useSubmit } from "react-router-dom";
import EditColumn from "./EditColumn";
import DialogBox from "../../shared/DialogBox";
import { useState } from "react";

const StyledTableCell = styled(TableCell)({
  fontWeight: "800",
  fontSize: "1.15rem",
  textAlign: "center",
});

function TableDetail({ table }) {
  const nonMobileScreenSize = useMediaQuery("(min-width:600px)");
  const submit = useSubmit();
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleModelOpen = (column_name) => {
    setModalOpen(true);
    setSelectedColumn(column_name);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleDeleteRequest = () => {
    submit({ column_name: selectedColumn }, { method: "DELETE" });
    handleClose();
  };

  return (
    <>
      <DialogBox
        modalOpen={modalOpen}
        handleClose={handleClose}
        title={"Delete Request"}
        content={`Are you sure in deleting column name '${selectedColumn}'?`}
        confirmButtonColor={"error"}
        confirmText={"DELETE"}
        handleRequest={handleDeleteRequest}
      ></DialogBox>
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: nonMobileScreenSize ? "70vw" : "90vw",
          marginTop: "1rem",
        }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow
              sx={{
                fontWeight: "900",
                bgcolor: "aqua",
              }}
            >
              <StyledTableCell align="center">S.No</StyledTableCell>
              <StyledTableCell align="center">Column</StyledTableCell>
              <StyledTableCell align="center">Data type</StyledTableCell>
              <StyledTableCell align="center">Foreign Key</StyledTableCell>
              <StyledTableCell align="center">Edit</StyledTableCell>
              <StyledTableCell align="center">Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {table.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row" align="center">
                  {index + 1}
                </TableCell>
                <TableCell align="center">{row.column_name}</TableCell>
                <TableCell align="center">{row.data_type}</TableCell>
                <TableCell align="center">
                  {row.foreign_keys == null || row.foreign_keys.length == 0 ? (
                    "-"
                  ) : (
                    <>
                      <Typography>
                        Table: {row.foreign_keys[0].referenced_table_name}
                      </Typography>
                      <Typography>
                        Column: {row.foreign_keys[0].referenced_column_name}
                      </Typography>
                    </>
                  )}
                </TableCell>
                <TableCell align="center">
                  <EditColumn column_name={row.column_name} />
                </TableCell>
                <TableCell align="center">
                  {!nonMobileScreenSize && (
                    <IconButton
                      onClick={() => handleModelOpen(row.column_name)}
                    >
                      <Delete color="error" />
                    </IconButton>
                  )}
                  {nonMobileScreenSize && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleModelOpen(row.column_name)}
                      endIcon={<Delete />}
                    >
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default TableDetail;
