

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { axiosUser } from "../../api/axios";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import UserApi from "../../services/Api/User/UserApi";
import { toast, useToast } from "../../components/ui/use-toast";

const formSchema = z.object({
    name: z.string().min(2).max(20),
    email: z.string().email().min(2).max(30),
    password: z.string().min(8).max(30),
    role: z.enum(["admin", "owner"]).nullable(), 

});

export default function ProfileForm() {
    const {toast} = useToast()
    const navigate = useNavigate();
    const form = useForm({
        resolver: zodResolver(formSchema),
    });
    const {
        control, // Correction: Utilisation de form.control au lieu de control
        setError,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (values) => {
        console.log('values', values);
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('role', values.role);
        formData.append('password', values.password);
       
        try {
            const { status, data } = await UserApi.create(formData);
            console.log('data', data,'status',status);
    
            if (status === 201) {
                
                toast({
                    title: "Success",
                    description: "user created successfully!",
                });
                navigate('/user/list')
                reset();
                setShowSuccessPopup(true);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                Object.entries(error.response.data.errors).forEach((error) => {
                    const [fieldName, errorMessages] = error;
                    setError(fieldName, {
                        message: errorMessages.join(),
                    });
                });
            } 
        }
    };
    

    return (
       <card className="w-50">
           <Form {...form} >
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control} // Correction: Utilisation de form.control
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John Doe"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control} // Correction: Utilisation de form.control
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
       <FormField
                            control={form.control} // Correction: Utilisation de form.control
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="owner"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control} // Correction: Utilisation de form.control
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
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
                        <Button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-20"
                        >
                            {isSubmitting && (
                                <Loader className={"mx-2 my-2 animate-spin"} />
                            )}{" "}
                            Create
                        </Button>
                    </form>
                </Form>
       </card>
             
       
    );
}
