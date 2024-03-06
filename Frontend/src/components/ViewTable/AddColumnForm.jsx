import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";

const dataTypes = ["integer", "boolean", "varchar", "date", "float"];

const AddColumnForm = ({ onAddColumn, closeDialog, tableName }) => {
  const [columnName, setColumnName] = useState("");
  const [dataType, setDataType] = useState("");
  const [isForeignKey, setIsForeignKey] = useState(false);
  const [referencedTable, setReferencedTable] = useState("");
  const [referencedColumn, setReferencedColumn] = useState("");
  const [availableTables, setAvailableTables] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [showSnackbar, setShowSnackBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [isLoadingTables, setIsLoadingTables] = useState(false);
  useEffect(() => {
    setIsLoadingTables(true);
    fetch(`${import.meta.env.VITE_REACT_API_BACKEND_URL}/api/tables/`)
      .then((response) => response.json())
      .then((data) => {
        setAvailableTables(data.tables.filter((table) => table !== tableName));
        setIsLoadingTables(false);
      })
      .catch((error) => {
        console.error("Error fetching tables:", error);
      });
  }, []);

  const handleAddColumn = (event) => {
    event.preventDefault();
    const columnData = {
      column_name: columnName,
      data_type: dataType,
      foreign_keys: isForeignKey
        ? [
            {
              referenced_table_name: referencedTable,
              referenced_column_name: referencedColumn,
            },
          ]
        : [],
    };
    if (
      columnData.column_name.length === 0 ||
      columnData.column_name.split(/\s+/).length > 1
    ) {
      setShowSnackBar(true);
      setErrorMessage("Invalid column name");
      return;
    }
    if (!dataTypes.includes(dataType)) {
      setShowSnackBar(true);
      setErrorMessage("Invalid data type");
      return;
    }
    if (isForeignKey && referencedTable.length == 0) {
      setShowSnackBar(true);
      setErrorMessage("Invalid referenced table");
      return;
    }
    if (isForeignKey && referencedColumn.length == 0) {
      setShowSnackBar(true);
      setErrorMessage("Invalid column table");
      return;
    }
    onAddColumn(columnData);

    setColumnName("");
    setDataType("");
    setIsForeignKey(false);
    setReferencedTable("");
    setReferencedColumn("");
    closeDialog();
  };

  const handleForeignKeyChange = (event) => {
    setIsForeignKey(event.target.checked);
    setReferencedTable("");
    setReferencedColumn("");
    setAvailableColumns([]);
  };

  const handleReferencedTableChange = (event) => {
    setReferencedTable(event.target.value);

    fetch(
      `${import.meta.env.VITE_REACT_API_BACKEND_URL}/api/tables/${
        event.target.value
      }/columns`
    )
      .then((response) => response.json())
      .then((data) => {
        setAvailableColumns(
          data.filter((column) => column.data_type === dataType)
        );
      });
  };

  const handleReferencedColumnChange = (event) => {
    setReferencedColumn(event.target.value);
  };

  const handleSnackBarClose = () => {
    setShowSnackBar(false);
    setErrorMessage(null);
  };

  return (
    <>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={5000}
        onClose={handleSnackBarClose}
        message={errorMessage}
      />
      <form onSubmit={handleAddColumn}>
        <Grid container spacing={2} marginTop={"1px"}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="text"
              label="Column Name"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="data-type">Data Type</InputLabel>
              <Select
                value={dataType}
                label="Data Type"
                id="data-type"
                onChange={(e) => setDataType(e.target.value)}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="integer">INTEGER</MenuItem>
                <MenuItem value="float">FLOAT</MenuItem>
                <MenuItem value="varchar">VARCHAR</MenuItem>
                <MenuItem value="boolean">BOOLEAN</MenuItem>
                <MenuItem value="date">DATE</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <FormGroup
          sx={{
            margin: "0.5rem 0",
          }}
        >
          <FormControlLabel
            control={<Checkbox />}
            checked={isForeignKey}
            label="Foreign Key"
            onChange={handleForeignKeyChange}
          />
        </FormGroup>

        {isForeignKey && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="referenced-table">Referenced Table</InputLabel>
                {isLoadingTables ? (
                  <Typography>Loading tables...</Typography>
                ) : (
                  <Select
                    labelId="referenced-table"
                    value={referencedTable}
                    label={"Referenced Table"}
                    onChange={handleReferencedTableChange}
                  >
                    <MenuItem value="">Select Table</MenuItem>
                    {availableTables.map((table) => (
                      <MenuItem key={table} value={table}>
                        {table}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="referenced-column">
                  Referenced Column
                </InputLabel>
                <Select
                  id="referenced-column"
                  label="Referenced Column"
                  value={referencedColumn}
                  onChange={handleReferencedColumnChange}
                >
                  <MenuItem value="">Select Column</MenuItem>
                  {availableColumns.map((column, index) => (
                    <MenuItem key={index} value={column.column_name}>
                      {column.column_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
        <Box display={"flex"} gap={3} marginTop={2} justifyContent={"flex-end"}>
          <Button variant="outlined" onClick={closeDialog}>
            Close
          </Button>
          <Button variant="contained" type="submit">
            Add Column
          </Button>
        </Box>
      </form>
    </>
  );
};

export default AddColumnForm;
