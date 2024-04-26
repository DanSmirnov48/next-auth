'use client'

import React, { useState, useTransition } from "react";
import { CardWrapper } from "./card-wrapper";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ResetSchema } from "@/schemas";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";
import { useSearchParams } from 'next/navigation'
import Link from "next/link";
import { reset } from "@/actions/reset";

export const ResetForm = () => {

    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        },
    })

    const handleReset = async (value: z.infer<typeof ResetSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            reset(value)
                .then((data) => {
                    setError(data.error)
                    setSuccess(data.success)
                })
        })
    };

    return (
        <CardWrapper
            headerLaberl="Forgot your password?"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleReset)}
                    className="flex flex-col gap-5 w-full mt-4 max-w-5xl mb-5"
                >
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

                    <FormError message={error} />
                    <FormSuccess message={success} />

                    <Button type="submit" disabled={isPending}>
                        Send Reset email
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
