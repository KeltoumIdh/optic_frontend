import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import dayjs from "dayjs";
import {
  Pencil,
  Plus,
  Search,
  UserPlus,
  Users,
  User,
  Shield,
  Loader,
  X,
  Calendar,
  Mail,
  UserCheck,
} from "lucide-react";
import axiosClient from "@/api/axiosClient";
import { useAuth } from "@/hooks/useAuth.jsx";
import Spinner from "@/components/Spinner";

// This component is used by the router with the name DataTableDemo
function ListUser() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { csrf } = useAuth();

  // Define fetch function inside useEffect to avoid dependency issues
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        await csrf();
        const response = await axiosClient.get("/api/users");
        if (response.status === 200) {
          setUsers(response.data);
          setFilteredUsers(response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des utilisateurs",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
    // Empty dependency array ensures this runs only once on mount
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.role.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredUsers(users);
  };

  const getRoleIcon = (role) => {
    if (role === "owner") return <Shield className="h-4 w-4 mr-1" />;
    return <User className="h-4 w-4 mr-1" />;
  };

  // Format date with dayjs
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  return (
    <div className="mx-auto px-2 py-4 md:px-4 md:py-6">
      <Card className="shadow-md border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3 border-b dark:border-gray-700">
          <div className="flex items-center">
            <Users className="h-6 w-6 mr-2 text-primary" />
            <CardTitle className="text-xl md:text-2xl font-bold">
              Liste des utilisateurs
            </CardTitle>
          </div>
          <CardDescription className="mt-2 text-gray-500 dark:text-gray-400">
            Gérer et modifier les utilisateurs du système
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-10 border-gray-300 focus:border-primary"
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                </button>
              )}
            </div>

            <Link to="/user/add" className="w-full md:w-auto">
              <Button className="w-full md:w-auto bg-primary hover:bg-primary/90">
                <UserPlus className="mr-2 h-4 w-4" />
                Ajouter un utilisateur
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Spinner />
            </div>
          ) : (
            <>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 border rounded-md bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                    Aucun utilisateur trouvé
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm
                      ? "Aucun utilisateur ne correspond à votre recherche."
                      : "Il n'y a pas encore d'utilisateurs dans le système."}
                  </p>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      onClick={clearSearch}
                      className="mt-4"
                    >
                      Effacer la recherche
                    </Button>
                  )}
                </div>
              ) : (
                <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-800">
                      <TableRow>
                        <TableHead className="font-medium">Nom</TableHead>
                        <TableHead className="font-medium">Email</TableHead>
                        <TableHead className="font-medium">Rôle</TableHead>
                        <TableHead className="font-medium">
                          Date de création
                        </TableHead>
                        <TableHead className="font-medium text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-gray-500" />
                              {user.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-gray-500" />
                              {user.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getRoleIcon(user.role)}
                              <span
                                className={`capitalize ${
                                  user.role === "owner"
                                    ? "text-primary font-medium"
                                    : ""
                                }`}
                              >
                                {user.role}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              {formatDate(user.created_at)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link to={`/user/edit/${user.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                              >
                                <Pencil className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {filteredUsers.length} utilisateur
                {filteredUsers.length !== 1 ? "s" : ""} trouvé
                {filteredUsers.length !== 1 ? "s" : ""}
                {searchTerm && " pour la recherche"}.
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Export both as default and named export to maintain compatibility
export default ListUser;
export { ListUser as DataTableDemo };
