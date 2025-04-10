import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { useLogout, useGetIdentity } from "@refinedev/core";
import { Link } from 'react-router-dom';

export const AccountPage = () => {
    const { mutate, isLoading } = useLogout();
    const { data: identity } = useGetIdentity();
    console.log(identity);
    const dateTime = new Date(identity?.exp * 1000); // Умножаем на 1000, чтобы перевести секунды в миллисекунды
    return (
        <div>
            <Typography variant={"h5"}>Добро пожаловать, {identity?.access_level ?? "пользователь"}</Typography>

                <Box sx={{ padding: 2, marginTop:6, borderRadius: 2 }}>
                <Grid container spacing={2}>
                    {/* Строка 1: Дата регистрации */}
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            <strong>Токен активен до:</strong> {dateTime.toLocaleDateString()}
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
                            <Button component={Link} // Используем Link как компонент
                                      to="/отправка" // Указываем путь
                                      variant="text"
                                      color="primary">
                                Подробнее
                            </Button>
                        </Typography>
                    </Grid>

                    {/* Строка 5: Привязанная почта */}
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            <strong>Привязанная почта</strong> {identity?.email}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}