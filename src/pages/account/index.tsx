import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { useLogout, useGetIdentity } from "@refinedev/core";
import { Link } from 'react-router-dom';

// Определяем тип для identity
interface Identity {
    access_level?: string;
    exp?: number;
    email?: string;
    // Добавьте другие поля, если они есть
}

export const AccountPage = () => {
    const { mutate, isLoading } = useLogout();
    const { data: identity } = useGetIdentity<Identity>(); // Указываем тип Identity

    // Проверяем, есть ли identity и поле exp
    const dateTime = identity?.exp ? new Date(identity.exp * 1000) : null;

    return (
        <div>
            <Typography variant={"h5"}>
                Добро пожаловать, {identity?.access_level ?? "пользователь"}
            </Typography>

            <Box sx={{ padding: 2, marginTop:6, borderRadius: 2 }}>
                <Grid container spacing={2}>
                    {/* Строка 1: Дата регистрации */}
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            <strong>Токен активен до:</strong> {dateTime ? dateTime.toLocaleDateString() : "неизвестно"}
                        </Typography>
                    </Grid>

                    {/* Строка 2: Организация */}
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            <strong>Организация</strong> Высшая Школа Экономики
                        </Typography>
                    </Grid>

                    {/* Строка 4: Файлы в обработке */}
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            <strong>Файлы в обработке</strong>{' '}
                            <Button
                                component={Link}
                                to="/отправка"
                                variant="text"
                                color="primary"
                            >
                                Подробнее
                            </Button>
                        </Typography>
                    </Grid>

                    {/* Строка 5: Привязанная почта */}
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            <strong>Привязанная почта</strong> {identity?.email ?? "не указана"}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}