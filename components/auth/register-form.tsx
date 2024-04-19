'use client'

import React, { useState, useTransition } from "react";
import { CardWrapper } from "./card-wrapper";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { RegisterSchema } from "@/schemas";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { register } from "@/actions/register";

export const RegisterForm = () => {

    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: ""
        },
    })

    const handleRegister = async (value: z.infer<typeof RegisterSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            register(value)
                .then((data) => {
                    setError(data.error)
                    setSuccess(data.sucess)
                })
        })
    };

    return (
        <CardWrapper
            headerLaberl="Create an account"
            backButtonLabel="Already have an account?"
            backButtonHref="/auth/login"
            showSocial
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleRegister)}
                    className="flex flex-col gap-5 w-full mt-4 max-w-5xl mb-5"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="John Doe" disabled={isPending} className="h-10" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="john.doe@email.com" disabled={isPending} className="h-10" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" disabled={isPending} className="h-10" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormError message={error} />
                    <FormSuccess message={success} />

                    <Button type="submit" disabled={isPending}>
                        Create an Account
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
