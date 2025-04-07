import React from 'react';
import {Button, Typography} from "@mui/material";
import {Link} from "react-router-dom";


export const SettingsPage = () => {
    return (
        <div>
            <Typography variant={"h5"}>Настройки</Typography>
            <Button sx={{marginTop: 4}} variant="contained" color="primary">Изменить почту</Button>
            <Link to={"/забыл-пароль"}><Button sx={{marginTop: 4, marginLeft: 2}} variant="contained" color="primary">Изменить пароль</Button></Link>
            <Typography sx={{marginTop: 3}} variant="body2">Для смены пароля Вам понадобится <b>доступ</b> к привязанной почте.</Typography>
            <Typography fontWeight={"bold"} sx={{marginTop: 6}} variant={"body1"}>Контакты разработчиков:</Typography>
            <Typography  sx={{marginTop: 2, marginLeft: 2}} variant={"body1"}>Александр @kerblif Лазаренко</Typography>
            <Typography sx={{marginTop: 2, marginLeft: 2}} variant={"body1"}>Михаил @Mikhail_0811 Крамаренко</Typography>
            <Typography sx={{marginTop: 2, marginLeft: 2}} variant={"body1"}>Микаэл @returntozer0 Оганесян</Typography>
        </div>
    )
}