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

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useToast } from "../../components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth.jsx";
import axiosClient from "@/api/axiosClient.jsx";

const formSchema = z.object({
  name: z.string().min(2).max(20),
  email: z.string().email().min(2).max(30),
  password: z.string().min(8).max(30),
  role: z.enum(["admin", "owner"]).nullable(),
});

export default function ProfileForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  console.log("role", formSchema.role);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "admin", // Default role value
    },
  });
  const {
    control, // Correction: Utilisation de form.control au lieu de control
    setError,
    formState: { isSubmitting },
  } = form;

  const { csrf } = useAuth();

  const onSubmit = async (values) => {
    console.log("values", values);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("role", values.role);
    console.log(values.role);
    formData.append("password", values.password);

    try {
      await csrf();
      const { status, data } = await axiosClient.post(
        "/api/users/add",
        formData
      );

      if (status === 201) {
        toast({
          title: "Success",
          description: "user created successfully!",
        });
        navigate("/user/list");
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
      <div className="flex items-center py-2">
        <Link to={"/clients"} className="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
        <h2 className=" md:text-2xl font-semibold  dark:text-gray-300 ">
          Ajouter un Utilisateurs
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control} // Correction: Utilisation de form.control
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
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
            control={control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <select {...field} className="px-2 py-1 mx-2 bg-white">
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
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
                  <Input type="password" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isSubmitting} type="submit" className="w-20">
            {isSubmitting && <Loader className={"mx-2 my-2 animate-spin"} />}{" "}
            Create
          </Button>
        </form>
      </Form>
    </card>
  );
}
