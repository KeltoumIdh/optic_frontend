import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth.jsx";
import axiosClient from "@/api/axiosClient.jsx";
import Spinner from "@/components/Spinner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Search,
  Activity,
  User,
  ShoppingCart,
  Package,
  Users,
  ArrowUpDown,
  RefreshCw,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });

  const itemsPerPage = 10;
  const { csrf } = useAuth();

  // Récupération des données
  const fetchActivities = async () => {
    try {
      setLoading(true);
      await csrf();
      const res = await axiosClient.get("/api/getAllActivities");

      const data = res.data?.data ?? [];
      setActivities(data);
      setFilteredActivities(data);

      // Appliquer le tri initial
      sortData(data, sortConfig.key, sortConfig.direction);
    } catch (err) {
      console.error("Erreur lors de la récupération des activités:", err);
    } finally {
      setLoading(false);
    }
  };

  // Gestion du tri des colonnes
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Appliquer le tri aux données
  const sortData = (data, key, direction) => {
    const sortedData = [...data].sort((a, b) => {
      if (key === "id") {
        return direction === "asc" ? a.id - b.id : b.id - a.id;
      }

      if (key === "user") {
        const userA = a?.user?.name?.toLowerCase() || "";
        const userB = b?.user?.name?.toLowerCase() || "";
        return direction === "asc"
          ? userA.localeCompare(userB)
          : userB.localeCompare(userA);
      }

      if (key === "type") {
        return direction === "asc"
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      }

      return 0;
    });

    setFilteredActivities(sortedData);
  };

  // Filtrer les activités en fonction de la recherche et du type
  useEffect(() => {
    let filtered = [...activities];

    // Filtrer par type
    if (typeFilter !== "all") {
      filtered = filtered.filter((activity) => {
        const type = activity.type || "";
        if (typeFilter === "user") return type.includes("user");
        if (typeFilter === "product") return type.includes("product");
        if (typeFilter === "client") return type.includes("client");
        if (typeFilter === "order") return type.includes("order");
        return true;
      });
    }

    // Filtrer par recherche
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((activity) => {
        const userName = activity?.user?.name?.toLowerCase() || "";
        const type = renderActivityType(activity.type).toLowerCase();
        const details = JSON.stringify(activity.details).toLowerCase();

        return (
          userName.includes(query) ||
          type.includes(query) ||
          details.includes(query)
        );
      });
    }

    // Appliquer le tri
    sortData(filtered, sortConfig.key, sortConfig.direction);
  }, [searchQuery, typeFilter, activities, sortConfig]);

  useEffect(() => {
    fetchActivities();
  }, []);

  // Obtenir les données paginées
  const getPaginatedData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredActivities.slice(startIndex, endIndex);
  };

  // Formatage des types d'activités
  const renderActivityType = (type) => {
    switch (type) {
      case "new_user_created":
        return "Nouvel utilisateur créé";
      case "user_updated":
        return "Utilisateur mis à jour";
      case "user_deleted":
        return "Utilisateur supprimé";
      case "password_updated":
        return "Mot de passe mis à jour";

      case "new_product_created":
        return "Nouveau produit créé";
      case "product_updated":
        return "Produit mis à jour";
      case "product_deleted":
        return "Produit supprimé";

      case "new_client_created":
        return "Nouveau client créé";
      case "client_updated":
        return "Client mis à jour";
      case "client_deleted":
        return "Client supprimé";

      case "new_order":
        return "Nouvelle commande créée";
      case "order_updated":
        return "Commande mise à jour";
      default:
        return type?.replace(/_/g, " ") || "Activité inconnue";
    }
  };

  // Badges pour les types d'activités
  const getActivityBadge = (type) => {
    let variant = "default";
    let icon = null;

    if (type?.includes("user")) {
      variant = "blue";
      icon = <User className="h-3 w-3 mr-1" />;
    } else if (type?.includes("product")) {
      variant = "green";
      icon = <Package className="h-3 w-3 mr-1" />;
    } else if (type?.includes("client")) {
      variant = "purple";
      icon = <Users className="h-3 w-3 mr-1" />;
    } else if (type?.includes("order")) {
      variant = "orange";
      icon = <ShoppingCart className="h-3 w-3 mr-1" />;
    }

    let badgeClass = "bg-gray-100 text-gray-800";

    if (variant === "blue") {
      badgeClass = "bg-blue-100 text-blue-800";
    } else if (variant === "green") {
      badgeClass = "bg-green-100 text-green-800";
    } else if (variant === "purple") {
      badgeClass = "bg-purple-100 text-purple-800";
    } else if (variant === "orange") {
      badgeClass = "bg-orange-100 text-orange-800";
    }

    return (
      <Badge className={`${badgeClass} flex items-center`} variant={variant}>
        {icon}
        {renderActivityType(type)}
      </Badge>
    );
  };

  // Formatage de la date
  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: fr,
      });
    } catch (err) {
      return "Date invalide";
    }
  };

  // Rendu des détails de l'activité
  const renderDetails = (details, type) => {
    try {
      const detailsObj =
        typeof details === "string" ? JSON.parse(details) : details;
      const { new_data, old_data } = detailsObj;

      // Pour les éléments supprimés
      if (type.includes("deleted")) {
        return (
          <div className="text-red-600 text-sm">
            <p>
              <strong>Supprimé:</strong>{" "}
              {old_data?.name || old_data?.email || "Élément supprimé"}
            </p>
          </div>
        );
      }
      // Pour les nouveaux éléments
      else if (
        new_data &&
        (!old_data || (Array.isArray(old_data) && old_data.length === 0))
      ) {
        if (type === "new_order") {
          const clientName = new_data.client?.name || "Client inconnu";
          return (
            <div className="text-green-600 text-sm">
              <p>
                <strong>Commande:</strong> #{new_data.id} pour {clientName}
              </p>
              <p>
                <strong>Montant:</strong>{" "}
                {JSON.parse(new_data.cart).total_price || "N/A"} DH
              </p>
            </div>
          );
        } else {
          return (
            <div className="text-green-600 text-sm">
              <p>
                <strong>Créé:</strong>{" "}
                {new_data.name || new_data.email || "Nouvel élément"}
              </p>
              {new_data.email && (
                <p>
                  <strong>Email:</strong> {new_data.email}
                </p>
              )}
            </div>
          );
        }
      }
      // Pour les mises à jour
      else if (new_data && old_data) {
        const changes = [];
        for (const key in new_data) {
          if (new_data[key] !== old_data[key]) {
            if (
              key === "image" ||
              key === "password" ||
              key === "payement_file"
            ) {
              changes.push(`${key} modifié`);
            } else {
              const oldVal = String(old_data[key] || "").substring(0, 20);
              const newVal = String(new_data[key] || "").substring(0, 20);
              changes.push(`${key}: "${oldVal}" → "${newVal}"`);
            }
          }
        }

        if (changes.length > 0) {
          return (
            <div className="text-amber-600 text-sm">
              <p>
                <strong>Modifications:</strong>
              </p>
              <ul className="list-disc ml-4">
                {changes.slice(0, 3).map((change, index) => (
                  <li key={index}>{change}</li>
                ))}
                {changes.length > 3 && (
                  <li>+ {changes.length - 3} autres modifications</li>
                )}
              </ul>
            </div>
          );
        }
      }

      return <p className="text-gray-500 text-sm">Aucun changement détecté</p>;
    } catch (error) {
      console.error("Erreur de traitement des détails:", error);
      return <p className="text-red-500 text-sm">Format de données invalide</p>;
    }
  };

  return (
    <div className=" mx-auto p-4">
      <Card className="border bg-white shadow-sm dark:bg-gray-950">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold">
            <div className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Journal d'activités
            </div>
          </CardTitle>
          <CardDescription>
            Suivez toutes les actions effectuées dans l'application
          </CardDescription>
          <div className="mt-4">
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Rechercher des activités..."
                  className="pl-9 h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Select
                  value={typeFilter}
                  onValueChange={(value) => {
                    setTypeFilter(value);
                    setCurrentPage(0);
                  }}
                >
                  <SelectTrigger className="w-[140px] h-10">
                    <div className="flex items-center">
                      <SelectValue placeholder="Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="user">Utilisateurs</SelectItem>
                    <SelectItem value="product">Produits</SelectItem>
                    <SelectItem value="client">Clients</SelectItem>
                    <SelectItem value="order">Commandes</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={fetchActivities}
                  className="h-10"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50  ">
                    <TableRow>
                      <TableHead className="font-medium w-[80px]">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("id")}
                          className="flex items-center p-0 h-auto font-medium"
                        >
                          ID <ArrowUpDown className="ml-2 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="font-medium">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("user")}
                          className="flex items-center p-0 h-auto font-medium"
                        >
                          Utilisateur <ArrowUpDown className="ml-2 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="font-medium">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("type")}
                          className="flex items-center p-0 h-auto font-medium"
                        >
                          Type <ArrowUpDown className="ml-2 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="font-medium">Détails</TableHead>
                      <TableHead className="font-medium hidden md:table-cell text-right">
                        Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getPaginatedData().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6">
                          <div className="flex flex-col items-center justify-center">
                            <Activity className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-lg font-medium text-gray-500">
                              Aucune activité trouvée
                            </p>
                            <p className="text-sm text-gray-400">
                              {searchQuery || typeFilter !== "all"
                                ? "Essayez de modifier vos critères de recherche"
                                : "Le journal d'activités est vide"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      getPaginatedData().map((activity) => (
                        <TableRow
                          key={activity.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <TableCell className="font-medium">
                            {activity.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {activity?.user?.name ||
                                    "Utilisateur inconnu"}
                                </p>
                                <p className="text-xs text-gray-500 md:hidden">
                                  {formatDate(activity.created_at)}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getActivityBadge(activity.type)}
                          </TableCell>
                          <TableCell className="max-w-[300px]">
                            {renderDetails(activity.details, activity.type)}
                          </TableCell>
                          <TableCell className="text-right hidden md:table-cell">
                            <div className="flex items-center justify-end text-gray-500 text-sm">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(activity.created_at)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredActivities.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Affichage de{" "}
                    {Math.min(
                      (currentPage + 1) * itemsPerPage,
                      filteredActivities.length
                    )}{" "}
                    sur {filteredActivities.length} activités
                  </div>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage(Math.max(0, currentPage - 1))
                          }
                          className={
                            currentPage === 0
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      {Array.from({
                        length: Math.min(
                          5,
                          Math.ceil(filteredActivities.length / itemsPerPage)
                        ),
                      }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setCurrentPage(i)}
                            isActive={currentPage === i}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage(
                              Math.min(
                                Math.ceil(
                                  filteredActivities.length / itemsPerPage
                                ) - 1,
                                currentPage + 1
                              )
                            )
                          }
                          className={
                            currentPage >=
                            Math.ceil(
                              filteredActivities.length / itemsPerPage
                            ) -
                              1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
