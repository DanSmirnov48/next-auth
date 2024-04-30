'use client'

import React, { useState, useTransition } from "react";
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
import { login } from "@/actions/login";
import { useSearchParams } from 'next/navigation'
import Link from "next/link";

export const LoginForm = () => {

    const searchParams = useSearchParams()
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider" : "";
    const callBackUrl = searchParams.get("callbackUrl")

    const [show2FA, setShow2FA] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    const handleLogin = async (value: z.infer<typeof LoginSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            login(value, callBackUrl)
                .then((data) => {
                    if (data.error) {
                        form.reset()
                        setError(data.error)
                    }
                    if (data.success) {
                        form.reset()
                        setSuccess(data.success)
                    }
                    if (data.twoFactor) {
                        setShow2FA(true)
                    }

                }).catch(() => setError("Something went Wrong"))
        })
    };

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
                    {show2FA && (
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Two Factor Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123456" disabled={isPending} className="h-10" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                    {!show2FA && (
                        <>
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
                                        <Button size={"sm"} variant={"link"} asChild className="px-0 font-light">
                                            <Link href="/auth/reset">
                                                Forgot password?
                                            </Link>
                                        </Button>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}

                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />

                    <Button type="submit" disabled={isPending}>
                        {show2FA ? "Confirm" : "Log In"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
