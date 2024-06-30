"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    LoginBodyType,
    LoginBody,
} from "@/schemaValidations/auth.schema";
import { AuthApi } from "@/repositories/auth.api";
import { useToast } from "@/components/ui/use-toast";

const LoginForm = () => {

    const authApi = new AuthApi();

    const { toast } = useToast()

    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: LoginBodyType) {
        try {
            const result = await authApi.login(values)
            toast({ description: result.message, duration: 4000 })

            console.log(result)
        } catch (error: any) {
            const errors = error.response.data.errors as { field: string, message: string }[]
            const statusCode = error.response.status
            if (statusCode === 422) {
                errors.forEach((err) => {
                    form.setError(err.field as "email" | "password", {
                        type: 'server',
                        message: err.message
                    })
                })
            } else {
                toast({ title: "Lỗi", description: error.response.data.message })
            }

        }

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="shadcn" {...field} />
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
                                <Input type="password" placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Đăng nhập</Button>
            </form>
        </Form>
    );
};

export default LoginForm;
