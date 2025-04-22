import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "../../components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth.jsx";
import axiosClient from "@/api/axiosClient.jsx";
import Spinner from "@/components/Spinner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
} from "../../components/ui/select";
import { User, ArrowLeft, Save, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50),
  email: z.string().email("Email invalide"),
  role: z.enum(["admin", "owner"], {
    required_error: "Veuillez sélectionner un rôle",
  }),
  password: z.string().optional().or(z.literal("")),
});

const EditUser = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { csrf } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      password: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        await csrf();
        const response = await axiosClient.get(`/api/users/edit/${id}`);
        if (response.status === 200) {
          // Update form values with user data
          form.reset({
            name: response.data.name || "",
            email: response.data.email || "",
            role: response.data.role || "",
            password: "", // Don't populate password field for security
          });
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les données de l'utilisateur",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    // Only include id as a dependency since it's needed to fetch the correct user
  }, [id]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await csrf();

      // Only include password if it was provided
      const userData = { ...data };
      if (!userData.password) {
        delete userData.password;
      }

      const response = await axiosClient.put(
        `/api/users/update/${id}`,
        userData
      );

      if (response.status === 200) {
        toast({
          title: "Succès",
          description: "Utilisateur mis à jour avec succès",
          variant: "success",
        });
        navigate("/user/list");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'utilisateur",
        variant: "destructive",
      });
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
              <User className="h-6 w-6 mr-2 text-primary" />
              <CardTitle className="text-xl md:text-2xl font-bold">
                Modifier l&apos;utilisateur
              </CardTitle>
            </div>
          </div>
          <CardDescription className="mt-2 text-gray-500 dark:text-gray-400">
            Modifier les informations de l&apos;utilisateur
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
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Entrez le nom" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="exemple@email.com"
                          {...field}
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
                      <FormLabel>Rôle</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un rôle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe (optionnel)</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Laisser vide pour ne pas changer"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Link to="/user/list">
                  <Button variant="outline" type="button">
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
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer
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
};

export default EditUser;
