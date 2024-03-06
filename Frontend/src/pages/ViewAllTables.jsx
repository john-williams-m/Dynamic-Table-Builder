import React, { Suspense, useState } from "react";
import {
  Await,
  defer,
  json,
  redirect,
  useLoaderData,
  useSubmit,
} from "react-router-dom";
import ViewTables from "../components/ViewTables";
import LoadingSpinner from "../shared/LoadingSpinner";
import { Container, Typography } from "@mui/material";
import DialogBox from "../shared/DialogBox";

function ViewAllTables() {
  const data = useLoaderData();
  const submit = useSubmit();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  const handleModelOpen = (table_name) => {
    setModalOpen(true);
    setSelectedTable(table_name);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleDeleteRequest = () => {
    submit({ table_name: selectedTable }, { method: "DELETE" });
    handleClose();
  };

  return (
    <>
      <DialogBox
        modalOpen={modalOpen}
        handleClose={handleClose}
        title={"Delete Request"}
        content={`Are you sure in deleting table name '${selectedTable}'? (Drop dependent objects too)`}
        confirmButtonColor={"error"}
        confirmText={"DELETE"}
        handleRequest={handleDeleteRequest}
      ></DialogBox>
      <Container
        disableGutters
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" textAlign={"center"} m={"1rem auto"}>
          Tables
        </Typography>
        <Suspense fallback={<LoadingSpinner />}>
          <Await resolve={data.tables}>
            {(loadTables) => (
              <ViewTables modalOpen={handleModelOpen} tables={loadTables} />
            )}
          </Await>
        </Suspense>
      </Container>
    </>
  );
}

export default ViewAllTables;

async function loadTables() {
  const response = await fetch(
    `${import.meta.env.VITE_REACT_API_BACKEND_URL}/api/tables`
  );
  if (!response.ok) {
    throw json({ message: "Could not fetch data" }, { status: 500 });
  } else {
    const data = await response.json();
    return data.tables;
  }
}

export async function loader() {
  return defer({
    tables: loadTables(),
  });
}

export async function action({ params, request }) {
  const data = await request.formData();
  const table_name = data.get("table_name");
  const response = await fetch(
    `${import.meta.env.VITE_REACT_API_BACKEND_URL}/api/tables/${table_name}`,
    {
      method: request.method,
    }
  );
  if (!response.ok) {
    throw json({ message: "Could not delete table" }, { status: 500 });
  } else {
    return redirect("/");
  }
}
