import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiSolidShow } from "react-icons/bi";
import { RiEditFill } from "react-icons/ri";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  // TableContainer,
  // TablePagination,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "../../components/ui/button";
import { useAuth } from "@/hooks/useAuth.jsx";
import axiosClient from "@/api/axiosClient.jsx";
import Loader from "@/components/loader";
import Spinner from "@/components/Spinner";
import { renderImageDir } from "@/helpers/utils";

export default function Activities() {
  const [clients, setClients] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalClients, setTotalClients] = useState(0);

  const { csrf } = useAuth();

  const [loading, setLoading] = useState(false);

  const getClients = async () => {
    try {
      setLoading(true);

      await csrf();

      const res = await axiosClient.get("/api/getAllActivities");

      const data = res.data?.data ?? [];
      const total = res.data?.total_pages ?? 0;
      const totalClientsCount = res.data?.total ?? 0;
      setClients(data);
      setTotalPages(total);
      setTotalClients(totalClientsCount);
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

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

      case "unknown":
        return "Activité inconnue";

      default:
        return "##";
    }
  };
  const renderDetails = (details, type) => {
    try {
        const detailsObj = JSON.parse(details);
        const { new_data, old_data } = detailsObj;

        if (type === "user_deleted") {
            // Entry deleted
            const deletedDetails = Object.keys(old_data).map(
                (key) => `${key}: "${old_data[key]}"`
            );
            return `Deleted User ${deletedDetails.join(", ")}`;
        } else if (new_data && Array.isArray(old_data) && old_data.length === 0) {
            // New entry added
            if (type === "new_order") {
                const clientId = new_data.client_id;
                const clientName = new_data.client ? new_data.client.name : 'unknown';
                return `Ajouter une commande pour le client ${clientName} avec ID ${clientId}`;
            } else {
                const addedDetails = Object.keys(new_data).map(
                    (key) => `${key}: "${new_data[key]}"`
                );
                return `Added: ${addedDetails.join(", ")}`;
            }
        } else if (new_data && old_data) {
            // Entry updated
            const changes = [];
            for (const key in new_data) {
                if (new_data[key] !== old_data[key]) {
                    changes.push(
                        key === "image" || key === "password" || key === 'payement_file'
                            ? `${key}`
                            : `${key} changed from "${old_data[key]}" to "${new_data[key]}"`
                    );
                }
            }
            return changes.length > 0
                ? `Updated: ${changes.join(", ")}`
                : "No changes detected";
        } else {
            return "No details available";
        }
    } catch (error) {
        console.error("Error parsing details:", error);
        return "Invalid details format";
    }
};



  return (
    <div>
      <div className="flex p-2 justify-between">
        <h4 className="text-2xl font-semibold dark:text-gray-300">
          Activities
        </h4>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? suspense()
            : clients?.length === 0
            ? notFound()
            : clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.id}</TableCell>
                  <TableCell>
                    <div className="group cursor-context-menu flex items-center gap-2">
                      {/* <div className="w-10 h-10 bg-blue-50 rounded-full">
                      </div> */}
                      <span className="underline group-hover:no-underline text-blue-500">
                        {client?.user?.name ?? "unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{renderActivityType(client.type)}</TableCell>
                  <TableCell>
                    {renderDetails(JSON.stringify(client.details),client.type)}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      {!loading && clients?.length > 0 && (
        <div className="flex justify-between mt-4 lg:px-4">
          <div className="w-full">
            <p className="text-sm w-full text-gray-500">
              Showing {clients.length} of {totalClients} clients
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const suspense = () => (
  <TableRow className="bg-white hover:bg-white">
    <TableCell colSpan={5}>
      <Spinner />
    </TableCell>
  </TableRow>
);
const notFound = () => (
  <TableRow className="bg-white hover:bg-white">
    <TableCell colSpan={5}>No results!</TableCell>
  </TableRow>
);
