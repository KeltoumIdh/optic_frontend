import { useForm, Controller } from "react-hook-form";
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
} from "@/components/ui/select";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import UserApi from "../../services/Api/User/UserApi";
import { toast, useToast } from "../../components/ui/use-toast";
import { axiosUser } from "@/api/axios";
import { useEffect, useState } from "react";

const formSchema = z.object({
  name: z.string().min(2).max(20),
  email: z.string().email().min(2).max(30),
  password: z.string().min(8).max(30),
  role: z.enum(["admin", "owner"]),
});

export default function ProfileForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
  });
  const {
    control,
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values) => {
    console.log("values", values);
    const formData = {
      name: values.name,
      email: values.email,
      role: values.role,
      password: values.password,
    };

    try {
      const { status, data } = await UserApi.create(formData);
      console.log("data", data, "status", status);

      if (status === 201) {
        toast({
          title: "Success",
          description: "User created successfully!",
        });
        navigate("/user/list");
        form.reset();
      }
    } catch (error) {
      console.error("Error response:", error.response);
      if (error.response && error.response.data && error.response.data.errors) {
        Object.entries(error.response.data.errors).forEach(([fieldName, errorMessages]) => {
          setError(fieldName, {
            message: errorMessages.join(),
          });
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
  };

  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('optic-token');
        const response = await axiosUser.get('/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="w-50">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    className="w-[500px]"
                    placeholder="John Doe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="example@mail.com" {...field} className="w-[500px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="owner">Owner</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder=""
                    {...field}
                    className="w-[500px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {user?.role === "admin" ? (
            <Button disabled={isSubmitting} type="submit" className="w-20">
              {isSubmitting && <Loader className="mx-2 my-2 animate-spin" />}{" "}
              Create
            </Button>
          ) : (
            <p>You don't have access to create a user.</p>
          )}
        </form>
      </Form>
    </div>
  );
}
