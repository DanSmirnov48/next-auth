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
import { Eye, EyeOff } from "lucide-react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPDash,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { CardDescription, CardFooter } from "../ui/card";

export const LoginForm = () => {

    const searchParams = useSearchParams()
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider" : "";
    const callBackUrl = searchParams.get("callbackUrl")

    const [show2FA, setShow2FA] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [type, setType] = useState<'password' | 'text'>('password')

    const handleToggle = () => {
        if (type === 'password') {
            setType('text');
        } else {
            setType('password');
        }
    };

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
            showSocial={!show2FA}
        >
            {show2FA && (
                <CardDescription>
                    We emailed you a six-digit code to{" "}
                    <span className="font-bold text-base">{form.getValues("email")}</span>.
                    Enter the code below to confirm your email address.
                </CardDescription>
            )}
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
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field} containerClassName="group flex items-center justify-center has-[:disabled]:opacity-30 my-5">
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <InputOTPDash />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
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

                            <div className="relative">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex justify-between mt-2">
                                                <FormLabel className="shad-form_label">Password</FormLabel>
                                                <Link href="/auth/reset" className="text-xs text-gray-500 dark:text-gray-300 hover:underline">Forget Password?</Link>
                                            </div>
                                            <div className="relative">
                                                <FormControl className="flex-grow pr-10">
                                                    <Input type={type} maxLength={35} placeholder="Password" className="block w-full px-4 py-2 h-12" {...field} onFocus={() => setError(undefined)} />
                                                </FormControl>
                                                <span className="absolute right-3 top-3 cursor-pointer" onClick={handleToggle}>
                                                    {type === 'password' ? <Eye /> : <EyeOff />}
                                                </span>
                                            </div>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </>
                    )}

                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />

                    <Button type="submit" disabled={isPending}>
                        {show2FA ? "Confirm" : "Log In"}
                    </Button>

                    {show2FA && (
                        <CardFooter className="flex flex-col space-y-5 w-full mt-5 p-0">
                            <div id="alert-additional-content-5" className="p-4 border border-gray-300 rounded-lg bg-gray-50 dark:border-gray-600 dark:bg-gray-800" role="alert">
                                <div className="flex items-center">
                                    <svg className="flex-shrink-0 w-4 h-4 me-2 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                    </svg>
                                    <span className="sr-only">Info</span>
                                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-300">Didn't recieve code?</h3>
                                </div>
                                <div className="mt-2 mb-4 text-sm text-gray-800 dark:text-gray-300">
                                    If you did not recieve your code, please check your <span className="font-bold italic">Spam Folder</span> before requesting a new one!
                                </div>
                                <div className="flex">
                                    <button type="button" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-800">
                                        <svg className="me-2 h-3 w-3 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                                            <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                                        </svg>
                                        View more
                                    </button>
                                    <button type="button" className="text-gray-800 bg-transparent border border-gray-700 hover:bg-gray-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-800 dark:text-gray-300 dark:hover:text-white" data-dismiss-target="#alert-additional-content-5" aria-label="Close">
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </CardFooter>
                    )}
                </form>
            </Form>
        </CardWrapper>
    );
};
