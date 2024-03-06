import { Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useActionData } from "react-router-dom";
import Header from "./Header";
import AddColumnSection from "./AddColumnSection";
import TableDetail from "./TableDetail";

function ViewTable({ table }) {
  const [tableData, setTableData] = useState(table);
  const response = useActionData();

  const handleTableNameChange = (new_name) => {
    setTableData((prevData) => {
      const updatedData = { ...prevData };
      updatedData.name = new_name;
      return updatedData;
    });
  };

  useEffect(() => {
    if (!response) return;
    if (response && response.action === "ColumnDeleteAction") {
      const { column_name } = response;
      setTableData((prevData) => {
        const updatedData = { ...prevData };
        updatedData.description = updatedData.description.filter(
          (column) => column.column_name !== column_name
        );
        return updatedData;
      });
    }

    if (response && response.action === "ColumnRenameAction") {
      const { new_column_name, old_column_name } = response;
      setTableData((prevData) => {
        const updatedData = { ...prevData };
        const newDescription = updatedData.description.map((row) => {
          let temp = { ...row };
          if (row.column_name === old_column_name)
            temp.column_name = new_column_name;
          return temp;
        });
        return {
          ...updatedData,
          description: newDescription,
        };
      });
    }
    if (response && response.action === "AddColumnAction") {
      const { columnData } = response;
      setTableData((prevData) => {
        const updatedData = { ...prevData };
        updatedData["description"].push(columnData);
        return updatedData;
      });
    }
  }, [response]);

  return (
    <>
      <Container
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Header
          name={tableData.name}
          handleTableNameChange={handleTableNameChange}
        />
        <AddColumnSection tableName={tableData.name} />
        {tableData.description.length === 0 && (
          <>
            <Typography variant="h6" m={3}>
              No Columns found
            </Typography>
          </>
        )}
        {tableData.description.length > 0 && (
          <TableDetail table={tableData.description} />
        )}
      </Container>
    </>
  );
}

export default ViewTable;
