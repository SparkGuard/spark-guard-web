import { useList } from "@refinedev/core";
import React from "react";
import { useDataGrid } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface IWork {
    event: number;
    id: number;
    student: number;
    time: string;
}

const ProductTable: React.FC = () => {
    const authToken = localStorage.getItem("my_access_token");

    const { dataGridProps } = useDataGrid<IWork>({
        resource: "works",
        meta: {
            headers: {
                "Authorization": `Bearer ${authToken}`,
            },
        },
    });

    const columns = React.useMemo<GridColDef<IWork>[]>(
        () => [
            {
                field: "id",
                headerName: "ID",
                type: "number",
                width: 50,
            },
            {
                field: "event",
                headerName: "Event",
                type: "number",
                width: 100,
            },
            {
                field: "student",
                headerName: "Student",
                type: "number",
                width: 100,
            },
            {
                field: "time",
                headerName: "Time",
                minWidth: 200,
                flex: 1,
            },
        ],
        []
    );

    const handleRowClick = async (params: any) => {
        const workId = params.row.id;

        try {
            // Первый запрос для получения URL
            const initialResponse = await fetch(`http://217.12.40.66:8080/works/${workId}/download`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Accept": "application/json",
                },
            });

            if (!initialResponse.ok) {
                const text = await initialResponse.text();
                console.error("Ошибка при получении URL:", initialResponse.status, text);
                throw new Error(`Ошибка: ${initialResponse.status} - ${text}`);
            }

            // Парсим JSON и получаем URL
            const data = await initialResponse.json();
            const downloadUrl = data.url;

            if (!downloadUrl) {
                throw new Error("URL для скачивания не найден в ответе");
            }

            // Создаем ссылку и скачиваем файл напрямую
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `work_${workId}.zip`; // Устанавливаем имя файла
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Ошибка при скачивании:", error);
            alert("Не удалось скачать файл. Проверьте консоль для подробностей.");
        }
    };

    return (
        <div style={{ padding: "4px", marginTop: "24px" }}>
            <DataGrid
                {...dataGridProps}
                columns={columns}
                onRowClick={handleRowClick}
                sx={{ cursor: "pointer" }}
            />
        </div>
    );
};

export const SendingPage = () => {
    const authToken = localStorage.getItem("my_access_token") || "ВАШ_ТОКЕН_ЗДЕСЬ";

    const { data, isLoading } = useList({
        resource: "groups",
        meta: {
            headers: {
                "Authorization": `Bearer ${authToken}`,
            },
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Sending</h1>
            <ProductTable />
        </div>
    );
};