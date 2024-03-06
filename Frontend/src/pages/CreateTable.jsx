import React from "react";
import TableCreation from "../components/TableCreation";
import { json, redirect } from "react-router-dom";

function CreateTable() {
  return <TableCreation />;
}

export default CreateTable;

export async function action({ request }) {
  const data = await request.formData();
  const tableData = JSON.parse(data.get("tableData"));
  const response = await fetch(
    `${import.meta.env.VITE_REACT_API_BACKEND_URL}/api/tables`,
    {
      method: request.method,
      body: JSON.stringify(tableData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw json({ message: "Could not create table" }, { status: 500 });
  } else {
    return redirect("/");
  }
}
