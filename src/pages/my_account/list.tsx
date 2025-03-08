import { Stack, Typography } from "@mui/material";
import { useGetIdentity } from "@refinedev/core";
import {
    DateField,
    Show,
    TextFieldComponent as TextField,
} from "@refinedev/mui";

export const UserProfileShow = () => {
    // Используем хук useGetIdentity для получения данных о текущем пользователе
    const { data: user, isLoading } = useGetIdentity();

    return (
        <Show isLoading={isLoading}>
            <Stack gap={1}>
                <Typography variant="body1" fontWeight="bold">
                    {"Дата регистрации"}
                </Typography>
                <TextField value={"21.08.2024"} />

                <Typography variant="body1" fontWeight="bold">
                    {"Организация"}
                </Typography>
                <TextField value={"Высшая Школа Экономики"} />

                <Typography variant="body1" fontWeight="bold">
                    {"Статус"}
                </Typography>
                <TextField value={"Преподаватель"} />

                <Typography variant="body1" fontWeight="bold">
                    {"Файлы в обработке"}
                </Typography>
                <TextField value={"Подробнее"} />

                <Typography variant="body1" fontWeight="bold">
                    {"Привязанная почта"}
                </Typography>
                <DateField value={"maoganesian@edu.hse.ru"} />
            </Stack>
        </Show>
    );
};