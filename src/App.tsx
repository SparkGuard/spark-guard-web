import {Authenticated, Refine, useLogout, WelcomePage} from "@refinedev/core";
import { dataProvider } from "./providers/data-provider";
import { authProvider } from "./providers/auth-provider";
import {Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography, CssBaseline} from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Импорт React Router

// Menu Icons + logo
import SparkLogo from "./assets/img.png"
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ClearAllOutlinedIcon from '@mui/icons-material/ClearAllOutlined';
import WebhookOutlinedIcon from '@mui/icons-material/WebhookOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// Menu Icons


import { ShowProduct } from "./products/show";
import { EditProduct } from "./products/edit";
import { ListProducts } from "./products/list";


// Pages for React.router
import {AboutPage} from "./pages/about";
import {AccountPage} from "./pages/account";
import {GroupsPage} from "./pages/groups";
import {SendingPage} from "./pages/sending";
import {SettingsPage} from "./pages/settings";
import {ErrorPage} from "./pages/error";
import {Login} from "./components/login";
import {LogoutButton} from "./components/logoutButton";
import {ForgotPasswordPage} from "./pages/forgot_password";
//Pages for React.router

function App() {
    const menuIcons = [
        <PermIdentityOutlinedIcon />,
        <SendOutlinedIcon />,
        <ClearAllOutlinedIcon />,
        <WebhookOutlinedIcon />,
        <InfoOutlinedIcon />,
    ];
    console.log(localStorage.getItem("my_access_token"));
    return (
        <Refine dataProvider={dataProvider} authProvider={authProvider}>
            <CssBaseline />
            <Authenticated key="protected" fallback={<Login />}>
            <Router> {/* Оборачиваем приложение в Router */}
                <Box sx={{
                    margin: 0,
                    padding: 0,
                    minHeight: '100vh', // Занимает всю высоту экрана
                    background: 'linear-gradient(45deg, #FFF2DC 0%, #FFCDC5 100%)', // Градиент
                    display: 'flex',
                }} display="flex">
                    {/* Меню слева */}
                    <Drawer
                        variant="permanent"
                        sx={{
                            width: 240,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: 240,
                                boxSizing: 'border-box',
                                background: 'rgba(255, 255, 255)',
                            },
                        }}
                    >
                        <Box>
                                <img
                                    src={SparkLogo} // URL изображения
                                    alt="Пример изображения" // Альтернативный текст
                                    style={{ width: '40%', height: 'auto', marginLeft: '25%', marginTop: 10 }} // Стили
                                />
                        </Box>
                        <List sx={{ marginTop: 2 }}>
                            {['Мой аккаунт', 'Отправка', 'Группы работ', 'Контакты', 'О системе'].map((text, index) => (
                                <ListItem
                                    sx={{ marginTop: index === 3 ? "90%" : 2 }}
                                    key={text}
                                    component={Link} // Используем Link для навигации
                                    to={index === 0 ? "/" : `/${text.toLowerCase().replace(/\s+/g, '-')}`} // Динамические пути
                                >
                                    <ListItemIcon>
                                        {menuIcons[index]}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItem>
                            ))}
                            <LogoutButton/>
                        </List>
                    </Drawer>


                    {/* Контент справа */}
                    <Box component="main" sx={{ flexGrow: 1, p: 3, margin: 4, padding: 6, background: "white", borderRadius: 6, }}>
                        <Routes> {/* Маршруты */}

                            {/*Change routes to components*/}
                            <Route path="/" element={<AccountPage/>} />
                            <Route path="/забыл-пароль" element={<ForgotPasswordPage/>} />
                            <Route path="/мой-аккаунт" element={<AccountPage/>} />
                            <Route path="/отправка" element={<SendingPage/>} />
                            <Route path="/группы-работ" element={<GroupsPage/>} />
                            <Route path="/контакты" element={<SettingsPage/>} />
                            <Route path="/о-системе" element={<AboutPage/>} />
                            <Route path="*" element={<ErrorPage />} />
                        </Routes>
                    </Box>
                </Box>
            </Router>
            </Authenticated>
        </Refine>
    );
}

export default App;