import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { useLogout, useGetIdentity } from "@refinedev/core";
import { Link } from 'react-router-dom';

export const AccountPage = () => {
    const { mutate, isLoading } = useLogout();
    const { data: identity } = useGetIdentity();
    return (
        <div>
            <Typography variant={"h5"}>Добро пожаловать, {identity?.name ?? "пользователь"}</Typography>

                <Box sx={{ padding: 2, marginTop:6, borderRadius: 2 }}>
                <Grid container spacing={2}>
                    {/* Строка 1: Дата регистрации */}
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            <strong>Дата регистрации</strong> 21.08.2024
                        </Typography>
                    </Grid>

                    {/* Строка 2: Организация */}
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            <strong>Организация</strong> Высшая Школа Экономики
                        </Typography>
                    </Grid>

                    {/* Строка 3: Статус */}
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            <strong>Статус</strong> Преподаватель
                        </Typography>
                    </Grid>

                    {/* Строка 4: Файлы в обработке */}
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            <strong>Файлы в обработке</strong>{' '}
                            <Button component={Link} // Используем Link как компонент
                                      to="/группы-работ" // Указываем путь
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
            <Button sx={{margin: 2, marginTop: 4}} variant="contained" color="primary">Изменить почту</Button>
            <Link to={"/забыл-пароль"}><Button sx={{margin: 2, marginTop: 4}} variant="contained" color="primary">Изменить пароль</Button></Link>
            <Typography sx={{margin: 3}} variant="body2">Для смены пароля Вам понадобится <b>доступ</b> к привязанной почте.</Typography>
        </div>
    );
}