import  React from 'react';
import {ListItem, ListItemIcon, ListItemText} from "@mui/material";
import {Link} from "react-router-dom";
import {useLogout} from "@refinedev/core";

export const LogoutButton = () => {
    const {mutate, isLoading} = useLogout();

    return (
        <ListItem
            sx={{ marginTop: 2 }}
            to={"/"}
            key={"Выход"}
            onClick={() => mutate()}
            component={Link} // Используем Link для навигации
        >
            <ListItemText primary={"Выход"} />
        </ListItem>
    )
}