import { json } from "react-router-dom";

export async function action({ params, request }) {
    const table_name = params.table_name;
    const data = await request.formData();
    if (request.method === "DELETE") {
        const column_name = data.get("column_name");
        const response = await fetch(
            `${import.meta.env.VITE_REACT_API_BACKEND_URL}/api/tables/${table_name}/columns/${column_name}`,
            {
                method: request.method,
            }
        );
        if (!response.ok) {
            throw json({ message: "Could not delete column" }, { status: 500 });
        }
        return { action: 'ColumnDeleteAction', column_name };
    }
    if (request.method === "PATCH") {
        const new_column_name = data.get("new_column_name");
        const old_column_name = data.get("old_column_name");
        const response = await fetch(
            `${import.meta.env.VITE_REACT_API_BACKEND_URL}/api/tables/${table_name}/columns/${old_column_name}`,
            {
                method: 'PATCH',
                body: JSON.stringify({ newName: new_column_name }),
                headers: {
                    'Content-Type': 'application/json'
                }
            },
        );
        if (!response.ok) {
            throw json({ message: "Could not rename column" }, { status: 500 });
        }
        return { action: 'ColumnRenameAction', new_column_name, old_column_name };
    }
    if (request.method === 'POST') {
        const columnData = JSON.parse(data.get("columnData"));
        const response = await fetch(
            `${import.meta.env.VITE_REACT_API_BACKEND_URL}/api/tables/${table_name}/columns`,
            {
                method: request.method,
                body: JSON.stringify(columnData),
                headers: {
                    'Content-Type': 'application/json'
                }
            },
        );
        if (!response.ok) {
            throw json({ message: "Could not add column" }, { status: 500 });
        }
        return { action: 'AddColumnAction', columnData };
    }
}