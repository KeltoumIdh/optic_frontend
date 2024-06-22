import { useContext, useState, useEffect } from "react"; // Importez useContext
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useUserContext } from "../context/AuthContext";
import { z } from "zod";
import axiosClient from "@/api/axiosClient";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  email: z.string().email().min(2).max(30),
  password: z.string().min(8).max(30),
});

export default  function Login() {
  const { authUser } =  useAuth();
  const { login, setAuthenticated, setToken } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser.isLoading) {
      if (authUser?.data) {
          navigate("/", { replace: true });

      }
    }
  }, [authUser]);

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const {
    setError,
    formState: { isSubmitting },
  } = form;

  const csrf = () => axiosClient.get("sanctum/csrf-cookie");

  // Définissez un gestionnaire de soumission
  const onSubmit = async (values) => {
    await csrf();

    const { data } = await axiosClient.post("api/auth/login", {
      email: values.email,
      password: values.password,
    });

    if (data?.is_ok === true) {
      window.localStorage.setItem("optic-token", data.data.token);
      window.localStorage.setItem("isAuth", true);
      authUser.mutate();

      // move to the home page
      navigate("/");
    } else {
      // show danger message
      // setAlert(data?.message ?? 'Something was wrong!')
      alert("Something was wrong!");
    }

    // try {
    //     const { status, data } = login(values.email, values.password)
    //         .then(response => {
    //             const status = response.status;

    //             console.log(status)

    //             if (status === 204) {
    //                 // setToken(data.token)
    //                 setAuthenticated(true)
    //                 navigate('/');
    //                 console.log('La requête a réussi avec le statut 200.');
    //             } else {
    //                 console.log(`Le statut de la réponse est ${status}.`);
    //             }
    //         })
    // } catch (error) {
    //     setError('email', {
    //         message: error.response.data.errors.email.join()
    //     });
    // }
  };

  return (
    <Card className="card">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
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
              control={form.control}
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
            <Button disabled={isSubmitting} type="submit" className="w-full">
              {isSubmitting && <Loader className={"mx-2 my-2 animate-spin"} />}{" "}
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
