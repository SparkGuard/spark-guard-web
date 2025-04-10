import { useList } from "@refinedev/core";
import { useDataGrid } from "@refinedev/mui";
import React, { useState, useEffect, useMemo } from "react";
import {
    Box,
    Button,
    TextField,
    MenuItem,
    Typography,
    CircularProgress,
    Paper,
    Grid,
    Snackbar,
    Alert,
    AlertColor
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface IEvent {
    id: number;
    name: string;
}

interface IWork {
    event: number;
    id: number;
    student: number;
    time: string;
}

interface ITask {
    id: number;
    status: string;
    tag: string;
    work: number;
}

export const SendingPage = () => {
    const authToken = localStorage.getItem("my_access_token") || "";

    // Состояния для формы отправки
    const [selectedEvent, setSelectedEvent] = useState<number | "">("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<{success: boolean; message: string} | null>(null);
    const [studentId, setStudentId] = useState<string>("");
    const [refreshKey, setRefreshKey] = useState(0);

    // Состояния для уведомлений
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: '',
        severity: 'info'
    });

    // Закрытие уведомления
    const handleCloseNotification = () => {
        setNotification(prev => ({...prev, open: false}));
    };

    // Показ уведомления
    const showNotification = (message: string, severity: AlertColor = 'info') => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    // Загрузка событий для выпадающего списка
    const { data: eventsData, isLoading: eventsLoading } = useList<IEvent>({
        resource: "event",
        meta: {
            headers: {
                "Authorization": `Bearer ${authToken}`,
            },
        },
    });

    // Загрузка работ для определения следующего ID
    const { data: worksData } = useList<IWork>({
        resource: "works",
        meta: {
            headers: {
                "Authorization": `Bearer ${authToken}`,
            },
        },
        queryOptions: {
            queryKey: [`works_${refreshKey}`]
        }
    });

    // Таблица работ
    const { dataGridProps } = useDataGrid<IWork>({
        resource: "works",
        meta: {
            headers: {
                "Authorization": `Bearer ${authToken}`,
            },
        },
        queryOptions: {
            queryKey: [`works_table_${refreshKey}`]
        }
    });

    const [eventNames, setEventNames] = useState<Record<number, string>>({});
    const [taskStatuses, setTaskStatuses] = useState<Record<number, string>>({});

    // Определение следующего ID для новой работы
    const nextId = useMemo(() => {
        if (!worksData?.data || worksData.data.length === 0) return 1;
        const maxId = Math.max(...worksData.data.map(work => work.id));
        return maxId + 1;
    }, [worksData]);

    // Обработчик выбора файла
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    // Отправка формы
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!selectedEvent || !selectedFile || !studentId) {
            showNotification("Пожалуйста, заполните все поля и выберите файл", "error");
            return;
        }

        setIsSubmitting(true);
        setSubmissionStatus(null);

        try {
            // 1. Создаем запись о работе
            const currentTime = new Date().toISOString();
            const workData = {
                event: selectedEvent,
                id: nextId,
                student: parseInt(studentId),
                time: currentTime
            };

            const createResponse = await fetch("http://217.12.40.66:8080/works", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(workData),
            });

            if (!createResponse.ok) {
                const text = await createResponse.text();
                throw new Error(`Ошибка при создании работы: ${createResponse.status} - ${text}`);
            }

            // 2. Явно ждем, пока работа будет доступна на сервере
            await waitForWorkToBeAvailable(nextId);

            // 3. Загружаем файл
            const formData = new FormData();
            formData.append("file", selectedFile);

            const uploadResponse = await fetch(`http://217.12.40.66:8080/works/${nextId}/upload`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                },
                body: formData,
            });

            if (!uploadResponse.ok) {
                const text = await uploadResponse.text();
                throw new Error(`Ошибка при загрузке файла: ${uploadResponse.status} - ${text}`);
            }

            showNotification("Работа успешно отправлена!", "success");

            // Сбрасываем форму
            setSelectedEvent("");
            setSelectedFile(null);
            setStudentId("");

            // Обновляем таблицу
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error("Ошибка при отправке работы:", error);
            showNotification(
                `Ошибка при отправке работы: ${error instanceof Error ? error.message : String(error)}`,
                "error"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Новая вспомогательная функция для проверки доступности работы
    const waitForWorkToBeAvailable = async (workId: number) => {
        const maxAttempts = 5;
        const delayMs = 500;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const response = await fetch(`http://217.12.40.66:8080/works/${workId}`, {
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                    },
                });

                if (response.ok) {
                    return; // Работа доступна
                }
            } catch (error) {
                console.warn(`Попытка ${attempt}: Работа еще не доступна`, error);
            }

            // Ждем перед следующей попыткой
            if (attempt < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }

        throw new Error(`Работа ${workId} не стала доступна после ${maxAttempts} попыток`);
    };

    // Загрузка имен событий и статусов задач для таблицы
    const fetchEventName = async (eventId: number) => {
        try {
            const response = await fetch(`http://217.12.40.66:8080/event/${eventId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Accept": "application/json",
                },
            });

            if (!response.ok) {
                const text = await response.text();
                console.error(`Ошибка при получении события ${eventId}:`, response.status, text);
                return "Неизвестно";
            }

            const eventData: IEvent = await response.json();
            return eventData.name || "Неизвестно";
        } catch (error) {
            console.error(`Ошибка при загрузке события ${eventId}:`, error);
            return "Неизвестно";
        }
    };

    const fetchTaskStatus = async (workId: number) => {
        try {
            const response = await fetch(`http://217.12.40.66:8080/tasks/${workId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Accept": "application/json",
                },
            });

            if (!response.ok) {
                const text = await response.text();
                console.error(`Ошибка при получении задачи для работы ${workId}:`, response.status, text);
                return "Неизвестно";
            }

            const taskData: ITask = await response.json();
            return taskData.status || "Неизвестно";
        } catch (error) {
            console.error(`Ошибка при загрузке задачи для работы ${workId}:`, error);
            return "Неизвестно";
        }
    };

    useEffect(() => {
        const loadData = async () => {
            if (dataGridProps.rows) {
                const newEventNames: Record<number, string> = {};
                const newTaskStatuses: Record<number, string> = {};
                const uniqueEventIds = [...new Set(dataGridProps.rows.map((row) => row.event))];
                const workIds = dataGridProps.rows.map((row) => row.id);

                await Promise.all([
                    ...uniqueEventIds.map(async (eventId) => {
                        const name = await fetchEventName(eventId);
                        newEventNames[eventId] = name;
                    }),
                    ...workIds.map(async (workId) => {
                        const status = await fetchTaskStatus(workId);
                        newTaskStatuses[workId] = status;
                    })
                ]);

                setEventNames(newEventNames);
                setTaskStatuses(newTaskStatuses);
            }
        };

        loadData();
    }, [dataGridProps.rows]);

    // Скачивание исходников
    const handleDownloadClick = async (workId: number) => {
        try {
            const initialResponse = await fetch(`http://217.12.40.66:8080/works/${workId}/download`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Accept": "application/json",
                },
            });

            if (!initialResponse.ok) {
                const text = await initialResponse.text();
                throw new Error(`Ошибка: ${initialResponse.status} - ${text}`);
            }

            const data = await initialResponse.json();
            const downloadUrl = data.url;

            if (!downloadUrl) {
                throw new Error("URL для скачивания не найден");
            }

            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `work_${workId}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showNotification("Началось скачивание исходников", "success");
        } catch (error) {
            console.error("Ошибка при скачивании:", error);
            showNotification(
                `Не удалось скачать файл: ${error instanceof Error ? error.message : String(error)}`,
                "error"
            );
        }
    };

    // Скачивание отчета
    const handleReportDownloadClick = async (workId: number) => {
        try {
            const response = await fetch(`http://217.12.40.66:8080/works/${workId}/adoptions/download`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Accept": "application/zip",
                },
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Ошибка: ${response.status} - ${text}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `report_${workId}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            showNotification("Началось скачивание отчета", "success");
        } catch (error) {
            console.error("Ошибка при скачивании отчета:", error);
            showNotification(
                `Не удалось скачать отчет: ${error instanceof Error ? error.message : String(error)}`,
                "error"
            );
        }
    };

    // Колонки таблицы
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
                headerName: "Event ID",
                type: "number",
                width: 100,
            },
            {
                field: "eventName",
                headerName: "Event Name",
                width: 150,
                renderCell: (params) => eventNames[params.row.event] || "Загрузка...",
            },
            {
                field: "student",
                headerName: "Student ID",
                type: "number",
                width: 100,
            },
            {
                field: "time",
                headerName: "Time",
                width: 150,
            },
            {
                field: "status",
                headerName: "Status",
                width: 150,
                renderCell: (params) => taskStatuses[params.row.id] || "Загрузка...",
            },
            {
                field: "download",
                headerName: "Исходники",
                width: 150,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleDownloadClick(params.row.id)}
                    >
                        Скачать
                    </Button>
                ),
            },
            {
                field: "report",
                headerName: "Отчет",
                width: 150,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleReportDownloadClick(params.row.id)}
                    >
                        Скачать
                    </Button>
                ),
            },
        ],
        [eventNames, taskStatuses]
    );

    return (
        <Box sx={{ p: 3 }}>
            {/* Уведомление */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>

            <Typography variant="h4" component="h1" gutterBottom>
                Отправка работ
            </Typography>

            {/* Форма отправки работы */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                    Новая работа
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                fullWidth
                                label="Событие"
                                value={selectedEvent}
                                onChange={(e) => setSelectedEvent(Number(e.target.value))}
                                required
                                disabled={eventsLoading || isSubmitting}
                            >
                                <MenuItem value="" disabled>
                                    {eventsLoading ? "Загрузка..." : "Выберите событие"}
                                </MenuItem>
                                {eventsData?.data.map((event) => (
                                    <MenuItem key={event.id} value={event.id}>
                                        {event.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="ID студента"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                required
                                disabled={isSubmitting}
                                type="number"
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={<CloudUploadIcon />}
                                fullWidth
                                disabled={isSubmitting}
                            >
                                {selectedFile ? selectedFile.name : "Выберите архив"}
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".zip,.rar,.7z"
                                />
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting || !selectedEvent || !selectedFile || !studentId}
                                fullWidth
                                sx={{ mt: 1 }}
                            >
                                {isSubmitting ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : "Отправить работу"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {/* Таблица работ */}
            <Typography variant="h5" component="h2" gutterBottom>
                Отправленные работы
            </Typography>
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    {...dataGridProps}
                    columns={columns}
                    pageSizeOptions={[10, 25, 50]}
                    autoHeight
                    sx={{
                        '& .MuiDataGrid-cell': {
                            cursor: 'default',
                        },
                    }}
                />
            </Box>
        </Box>
    );
};