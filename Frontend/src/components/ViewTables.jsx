import { ArrowOutward, Delete } from "@mui/icons-material";
import {
  Box,
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
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)({
  fontWeight: "800",
  fontSize: "1.15rem",
  textAlign: "center",
});

function ViewTables({ tables, modalOpen }) {
  const nonMobileScreenSize = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  return (
    <>
      {tables.length === 0 && (
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          gap={2}
        >
          <Typography variant="h4">No table found!</Typography>
          <Typography variant="h5">Would you like to create one?</Typography>
          <Button variant="contained" onClick={() => navigate("/tables/new")}>
            Create Table
          </Button>
        </Box>
      )}
      {tables.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            width: nonMobileScreenSize ? "500px" : "300px",
            marginBottom: "1rem",
          }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="center">View</StyledTableCell>
                <StyledTableCell align="center">Delete</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tables.map((row) => (
                <TableRow
                  key={row}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" align="center" scope="row">
                    <Typography textTransform={"capitalize"}>{row}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    {!nonMobileScreenSize && (
                      <IconButton onClick={() => navigate(`/tables/${row}`)}>
                        <ArrowOutward color="info" />
                      </IconButton>
                    )}
                    {nonMobileScreenSize && (
                      <Button
                        variant="contained"
                        color="info"
                        onClick={() => navigate(`/tables/${row}`)}
                        endIcon={<ArrowOutward />}
                      >
                        <Link to={`/tables/${row}`}>View</Link>
                      </Button>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {!nonMobileScreenSize && (
                      <IconButton onClick={() => modalOpen(row)}>
                        <Delete color="error" />
                      </IconButton>
                    )}
                    {nonMobileScreenSize && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => modalOpen(row)}
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
      )}
    </>
  );
}

export default ViewTables;
