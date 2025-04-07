import {useForgotPassword, useGetIdentity} from "@refinedev/core";
import {Typography} from "@mui/material";

type ForgotPasswordVariables = {
    email: string;
};

export const ForgotPasswordPage = () => {
    const { mutate: forgotPassword } =
        useForgotPassword<ForgotPasswordVariables>();

    const { data: identity } = useGetIdentity();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const values = {
            email: e.currentTarget.email.value,
        };

        forgotPassword(values, {
            onSuccess: () => {
                alert("Проверьте вашу почту для дальнейших инструкций.");
            },
            onError: (error) => {
                alert("Произошла ошибка. Пожалуйста, попробуйте снова.");
                console.error(error);
            },
        });
    };

    return (
        <form onSubmit={onSubmit}>
            <Typography variant={"h5"}>Актуальная почта</Typography><br/>
            <Typography variant={"body1"}>{identity?.email ?? "Не найдена привязанная почта"}</Typography>
            <button className={"forgot-password-submit"} type="submit">Изменить пароль</button>
        </form>
    );
};