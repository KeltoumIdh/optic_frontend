import { useEffect } from "react";
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
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { z } from "zod";
import axiosClient from "@/api/axiosClient";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { backEndUrl } from "@/helpers/utils";

const formSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(2, "Email is required")
    .max(50, "Email is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password is too long"),
});

export default function Login() {
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authUser.isLoading) {
      if (authUser?.data) {
        navigate("/", { replace: true });
      }
    }
  }, [authUser]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const csrf = () => axiosClient.get("sanctum/csrf-cookie");

  const onSubmit = async (values) => {
    try {
      setError("");
      await csrf();

      const { data } = await axiosClient.post("api/auth/login", {
        email: values.email,
        password: values.password,
      });

      if (data?.is_ok === true) {
        window.localStorage.setItem("optic-token", data.data.token);
        window.localStorage.setItem("isAuth", true);
        authUser.mutate();
        navigate("/");
      } else {
        setError(data?.message || "An error occurred during login");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message ||
          "Invalid credentials. Please check your email and password."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-8">
        <img
          src={`${backEndUrl}/assets/logo/logo.png`}
          alt="Optic Logo"
          className="w-32 h-auto"
        />
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Optic Management System
        </h1>
        <p className="mt-2 text-center text-gray-600 max-w-sm">
          Your complete solution for optical store management and customer
          service
        </p>
      </div>

      <Card className="w-full max-w-md bg-white/70 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <p className="text-sm text-gray-600 text-center">
            Sign in to your account to continue
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700">
                      <Mail className="h-4 w-4" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700">
                      <Lock className="h-4 w-4" />
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium py-2.5 mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} Optic Management System. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
