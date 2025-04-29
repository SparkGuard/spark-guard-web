import { useList } from "@refinedev/core";
import React from "react";
import { useDataGrid } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

console.log(localStorage.getItem("my_access_token"));

const GroupsTable: React.FC = () => {
    const { dataGridProps } = useDataGrid<IProduct>({
        resource: "groups",
    });

    const columns = React.useMemo<GridColDef<IProduct>[]>(
        () => [
            {
                field: "id",
                headerName: "ID",
                type: "number",
                width: 50,
            },
            { field: "name", headerName: "Name", minWidth: 400, flex: 1 },
        ],
        [],
    );

    return (
        <div style={{ padding:"4px", marginTop:"24px" }}>
            <DataGrid {...dataGridProps} columns={columns} />
        </div>
    );
};


const EventsTable: React.FC = () => {
    const { dataGridProps } = useDataGrid<IProduct>({
        resource: "event",
    });

    const columns = React.useMemo<GridColDef<IProduct>[]>(
        () => [
            {
                field: "id",
                headerName: "ID",
                type: "number",
                width: 50,
            },
            { field: "name", headerName: "Name", minWidth: 400, flex: 1 },
        ],
        [],
    );

    return (
        <div style={{ padding:"4px", marginTop:"24px" }}>
            <DataGrid {...dataGridProps} columns={columns} />
        </div>
    );
};
interface IProduct {
    id: number;
    name: string;
}


export const GroupsPage = () => {
    const { data, isLoading } = useList({ resource: "groups" });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <GroupsTable/>
            <EventsTable/>
        </div>

    );
};