import React from 'react';
import {Button, Typography} from "@mui/material";
import {Link} from "react-router-dom";


export const SettingsPage = () => {
    return (
        <div>
            <Typography variant={"h5"}>Контакты разработчиков</Typography>
            <Typography  sx={{marginTop: 2, marginLeft: 2}} variant={"body1"}>Александр @kerblif Лазаренко</Typography>
            <Typography sx={{marginTop: 2, marginLeft: 2}} variant={"body1"}>Михаил @Mikhail_0811 Крамаренко</Typography>
            <Typography sx={{marginTop: 2, marginLeft: 2}} variant={"body1"}>Микаэл @returntozer0 Оганесян</Typography>
        </div>
    )
}