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
                    {"ID"}
                </Typography>
                <TextField value={user?.id} />

                <Typography variant="body1" fontWeight="bold">
                    {"Name"}
                </Typography>
                <TextField value={user?.name} />

                <Typography variant="body1" fontWeight="bold">
                    {"Email"}
                </Typography>
                <TextField value={user?.email} />

                <Typography variant="body1" fontWeight="bold">
                    {"Role"}
                </Typography>
                <TextField value={user?.role} />

                <Typography variant="body1" fontWeight="bold">
                    {"Created At"}
                </Typography>
                <DateField value={user?.createdAt} />
            </Stack>
        </Show>
    );
};