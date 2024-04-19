'use client'

import React from "react";
import { CardWrapper } from "./card-wrapper";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { LoginSchema } from "@/schemas";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

export const LoginForm = () => {

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    const handleLogin = async (value: z.infer<typeof LoginSchema>) => { };

    return (
        <CardWrapper
            headerLaberl="Welcome back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleLogin)}
                    className="flex flex-col gap-5 w-full mt-4 max-w-5xl mb-5"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="john.doe@email.com" className="h-10" {...field} />
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
                                    <Input type="password" className="h-10" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormError message="" />
                    <FormSuccess message="" />
                    
                    <Button type="submit" >
                        Log In
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
