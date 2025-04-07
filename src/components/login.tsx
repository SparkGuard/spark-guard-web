import React from "react";
import { useLogin } from "@refinedev/core";
import {Typography} from "@mui/material";
import SparkLogo from "../assets/img_hq.png";

export const Login = () => {
    const { mutate, isLoading } = useLogin();

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Using FormData to get the form values and convert it to an object.
        // @ts-ignore
        const data = Object.fromEntries(new FormData(event.target).entries());
        // Calling mutate to submit with the data we've collected from the form.
        mutate(data);
    };

    return (
        <div className="login-form">
            <img className={"SparkLogo"} alt={"Spark Guard"} src={SparkLogo} />
            <div className={"login-content"}>
            <Typography fontWeight={"bold"} variant="h4" gutterBottom>Искра</Typography>
                <Typography variant="h5">Антиплагиат система</Typography>
                <form className={"login-container"} onSubmit={onSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        // We're providing default values for demo purposes.
                        defaultValue="demo@demo.com"
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        defaultValue="demodemo"
                    />

                    {isLoading && <span>loading...</span>}
                    <button type="submit" disabled={isLoading}>
                        Войти в систему
                    </button>
                </form>
            </div>
        </div>
    );
};