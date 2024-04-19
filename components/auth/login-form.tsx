import React from "react";
import { CardWrapper } from "./card-wrapper";

export const LoginForm = () => {
    return (
        <CardWrapper
            headerLaberl="Welcome back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial
        >
            LoginForm
        </CardWrapper>
    );
};