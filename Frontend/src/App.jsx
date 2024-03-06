import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ViewAllTables, {
  action as deleteTableAction,
  loader as loadAvailableTables,
} from "./pages/ViewAllTables";
import RootLayout from "./shared/RootLayout";
import ViewSingleTable, { loader as loadTable } from "./pages/ViewSingleTable";
import CreateTable, { action as createTableAction } from "./pages/CreateTable";
import Error from "./pages/Error";
import { action as viewTableActions } from "./components/ViewTable/viewtable-action";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: <ViewAllTables />,
          loader: loadAvailableTables,
          action: deleteTableAction,
        },
        {
          path: "tables",
          children: [
            {
              path: "new",
              element: <CreateTable />,
              action: createTableAction,
            },
            {
              path: ":table_name",
              element: <ViewSingleTable />,
              loader: loadTable,
              action: viewTableActions,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
