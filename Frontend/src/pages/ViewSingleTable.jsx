import React, { Suspense } from "react";
import { Await, defer, json, useLoaderData } from "react-router-dom";
import LoadingSpinner from "../shared/LoadingSpinner";
import ViewTable from "../components/ViewTable/ViewTable";

function ViewSingleTable() {
  const data = useLoaderData();
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={data.table}>
        {(loadTable) => <ViewTable table={loadTable} />}
      </Await>
    </Suspense>
  );
}

export default ViewSingleTable;

async function loadTable(table_name) {
  const response = await fetch(
    `${import.meta.env.VITE_REACT_API_BACKEND_URL}/api/tables/${table_name}`
  );
  if (!response.ok) {
    throw json({ message: "Could not fetch table data" }, { status: 500 });
  } else {
    const data = await response.json();
    return data;
  }
}

export async function loader({ params }) {
  return defer({
    table: loadTable(params.table_name),
  });
}
