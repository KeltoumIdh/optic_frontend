import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { axiosUser } from "../../api/axios";
import { useToast } from "../../components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { KeyRound, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export const Update = () => {
  const { toast } = useToast();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { logout } = useUserContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const formSchema = z
    .object({
      old_password: z.string().min(8, {
        message: "Current password must be at least 8 characters",
      }),
      password: z
        .string()
        .min(8, {
          message: "Password must be at least 8 characters",
        })
        .regex(/[A-Z]/, {
          message: "Password must contain at least one uppercase letter",
        })
        .regex(/[a-z]/, {
          message: "Password must contain at least one lowercase letter",
        })
        .regex(/[0-9]/, {
          message: "Password must contain at least one number",
        }),
      confirmation_password: z.string(),
    })
    .refine((data) => data.password === data.confirmation_password, {
      message: "Passwords don't match",
      path: ["confirmation_password"],
    })
    .refine((data) => data.old_password !== data.password, {
      message: "New password must be different from current password",
      path: ["password"],
    });

  const { authUser } = useAuth();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      old_password: "",
      password: "",
      confirmation_password: "",
    },
  });

  const {
    formState: { isSubmitting },
    reset,
  } = form;

  const handleLogout = async () => {
    try {
      await logout();
      window.localStorage.removeItem("optic-token");
      window.localStorage.removeItem("isAuth");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const onSubmit = async (values) => {
    try {
      setError("");
      setSuccess(false);

      await axiosUser.post("/users/update/password", values);

      setSuccess(true);
      toast({
        title: "Success",
        description:
          "Password updated successfully. You will be logged out in 3 seconds.",
        variant: "success",
      });
      reset();

      // Logout after 3 seconds
      setTimeout(() => {
        handleLogout();
      }, 3000);
    } catch (error) {
      console.error("Error updating password:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to update password. Please try again.";
      setError(errorMessage);

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      if (error.response?.status === 401) {
        form.setError("old_password", {
          message: "Current password is incorrect",
        });
      }
    }
  };

  const isOwner = authUser?.data?.role === "owner";
  if (!isOwner) return null;

  return (
    <Card>
      <CardHeader>
        <h2 className={cn("text-lg font-semibold", isRTL && "text-right")}>
          {t("profile.changePassword")}
        </h2>
      </CardHeader>
      <CardContent className={cn("space-y-4", isRTL && "text-right")}>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert
            variant="success"
            className="mb-6 bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              {t("profile.passwordUpdatedSuccessfully")}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("space-y-6", isRTL && "text-right")}
          >
            <FormItem>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Lock className="h-4 w-4" />
                <span className={cn("text-sm", isRTL && "text-right")}>
                  {t("profile.currentPassword")}
                </span>
              </div>
              <FormControl>
                <Input
                  type="password"
                  {...form.register("old_password")}
                  className={cn(
                    "bg-gray-50 border-0 focus:ring-0",
                    isRTL && "text-right"
                  )}
                  placeholder={t("profile.enterCurrentPassword")}
                />
              </FormControl>
              <FormMessage className="text-xs mt-1" />
            </FormItem>

            <FormItem>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Lock className="h-4 w-4" />
                <span className={cn("text-sm", isRTL && "text-right")}>
                  {t("profile.newPassword")}
                </span>
              </div>
              <FormControl>
                <Input
                  type="password"
                  {...form.register("password")}
                  className={cn(
                    "bg-gray-50 border-0 focus:ring-0",
                    isRTL && "text-right"
                  )}
                  placeholder={t("profile.enterNewPassword")}
                />
              </FormControl>
              <FormMessage className="text-xs mt-1" />
              <ul
                className={cn(
                  "text-sm text-gray-500 space-y-1 mt-2",
                  isRTL && "text-right"
                )}
              >
                <li>{t("profile.passwordRequirements.minLength")}</li>
                <li>{t("profile.passwordRequirements.uppercase")}</li>
                <li>{t("profile.passwordRequirements.lowercase")}</li>
                <li>{t("profile.passwordRequirements.number")}</li>
              </ul>
            </FormItem>

            <FormItem>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Lock className="h-4 w-4" />
                <span className={cn("text-sm", isRTL && "text-right")}>
                  {t("profile.confirmNewPassword")}
                </span>
              </div>
              <FormControl>
                <Input
                  type="password"
                  {...form.register("confirmation_password")}
                  className={cn(
                    "bg-gray-50 border-0 focus:ring-0",
                    isRTL && "text-right"
                  )}
                  placeholder={t("profile.confirmNewPasswordPlaceholder")}
                />
              </FormControl>
              <FormMessage className="text-xs mt-1" />
            </FormItem>

            <CardFooter
              className={cn(
                "flex gap-2",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}
            >
              <Button
                type="submit"
                className={cn(
                  "w-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium py-2.5",
                  isRTL && "flex-row-reverse"
                )}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 justify-center">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t("profile.updatingPassword")}
                  </span>
                ) : (
                  t("profile.updatePassword")
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => reset()}>
                {t("profile.cancel")}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Update;
