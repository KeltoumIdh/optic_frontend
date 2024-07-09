import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { axiosUser } from "../../api/axios";
import { useToast } from "../../components/ui/use-toast";

export const Update = () => {
    const {toast} = useToast()
    const formSchema = z.object({
        old_password: z.string().min(8).max(30),
        password: z.string().min(8).max(30),
      
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
    });
    const { setError, formState: { isSubmitting }, reset } = form;


    const onSubmit = async values => {
        try {
            await axiosUser.post('/users/update/password', values);
            console.log('Password updated successfully');
             toast({
          title: "Success",
          description: "password updated successfully!",
        });
        reset();
        } catch (error) {
            console.error('Error updating password:', error);
            toast({
                title: "Error",
                description: "password not updated ",
              });

            if (error.response && error.response.data) {
                const { message } = error.response.data;
                setError("password", { message });
            }

        }
    };

    return (
        <div className="w-1/2 max-lg:w-full mt-2 h-full">
            <Card className="h-full">
                <CardHeader>
                    <CardDescription> Update Password </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="old_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Old Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder=""
                                                {...field}
                                            />
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
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder=""
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmation_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password Confirmation</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder=""
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button disabled={isSubmitting} type="submit" className="w-full">Submit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

export default Update;
