import { useState, useEffect } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useToast } from "../../components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth.jsx";
import axiosClient from "@/api/axiosClient.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { User, ArrowLeft, Plus, UserPlus, Loader, Shield } from "lucide-react";
import Spinner from "@/components/Spinner";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50),
  email: z.string().email("Email invalide"),
  role: z.enum(["admin", "owner"], {
    required_error: "Veuillez sélectionner un rôle",
  }),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export default function AddUser() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { csrf } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize form with empty values
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "admin",
      password: "",
    },
    mode: "onChange",
  });

  // Force form reset when component mounts to clear any cached values
  useEffect(() => {
    form.reset({
      name: "",
      email: "",
      role: "admin",
      password: "",
    });
  }, []);

  // Initialize form and possibly fetch any required data
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await csrf();
      } catch (error) {
        console.error("Error initializing form:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
    // Empty dependency array ensures this runs only once on mount
  }, []);

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      await csrf();

      const response = await axiosClient.post("/api/users/add", values);

      if (response.status === 201) {
        toast({
          title: "Succès",
          description: "Utilisateur créé avec succès",
          variant: "success",
        });
        navigate("/user/list");
        form.reset();
      }
    } catch (error) {
      console.error("Error creating user:", error);

      if (error.response?.data?.errors) {
        // Handle field validation errors from the server
        Object.entries(error.response.data.errors).forEach(
          ([fieldName, errorMessages]) => {
            form.setError(fieldName, {
              message: Array.isArray(errorMessages)
                ? errorMessages.join(", ")
                : errorMessages,
            });
          }
        );
      } else if (error.response?.data?.message) {
        // Server returned a specific error message
        toast({
          title: "Erreur de validation",
          description: error.response.data.message,
          variant: "destructive",
        });
      } else {
        // General error
        toast({
          title: "Erreur",
          description: "Impossible de créer l&apos;utilisateur",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto px-2 py-4 md:px-4 md:py-6">
        <Card className="shadow-md border border-gray-200 dark:border-gray-700">
          <CardContent className="flex justify-center items-center min-h-[300px]">
            <Spinner />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto px-2 py-4 md:px-4 md:py-6">
      <Card className="shadow-md border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4 border-b dark:border-gray-700">
          <div className="flex items-center">
            <Link
              to="/user/list"
              className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center">
              <UserPlus className="h-6 w-6 mr-2 text-primary" />
              <CardTitle className="text-xl md:text-2xl font-bold">
                Ajouter un utilisateur
              </CardTitle>
            </div>
          </div>
          <CardDescription className="mt-2 text-gray-500 dark:text-gray-400">
            Créer un nouvel utilisateur avec les informations requises
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <span className="mr-1">Nom</span>
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Entrez le nom"
                          {...field}
                          className="border-gray-300 focus:border-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <span className="mr-1">Email</span>
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="exemple@email.com"
                          {...field}
                          className="border-gray-300 focus:border-primary"
                          onChange={(e) => field.onChange(e.target.value)}
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
                      <FormLabel className="flex items-center">
                        <span className="mr-1">Mot de passe</span>
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Minimum 8 caractères"
                          {...field}
                          className="border-gray-300 focus:border-primary"
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <span className="mr-1">Rôle</span>
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-primary">
                            <SelectValue placeholder="Sélectionnez un rôle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem
                            value="admin"
                            className="flex items-center"
                          >
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              Admin
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="owner"
                            className="flex items-center"
                          >
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 mr-2" />
                              Owner
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Link to="/user/list">
                  <Button
                    variant="outline"
                    type="button"
                    className="border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                  >
                    Annuler
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Créer
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
