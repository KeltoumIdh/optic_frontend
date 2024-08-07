import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { axiosUser } from "../../api/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../../components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient.jsx";

export function ListCard() {
  const { csrf } = useAuth();

  const [clients, setClients] = React.useState([]);

  const [isLoading, setisLoading] = React.useState(false);

  const fetchClients = async () => {
    try {
      setisLoading(true);
      await csrf();
      const response = await axiosClient.get("/api/credit/clients");
      if (response.status === 200) {
        setClients(response.data);
        console.log("clients", response.data);
      } else {
        throw new Error("Failed to fetch clients");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setisLoading(false);
    }
  };

  React.useEffect(() => {
    fetchClients();
  }, []);

  const getStatusColorClass = (client) => {
    const currentDate = new Date();
    const finCreditDate = new Date(client.date_fin_credit);
    const daysRemaining = Math.ceil(
      (finCreditDate - currentDate) / (1000 * 3600 * 24)
    );

    if (daysRemaining < 0) {
      return "bg-red-600 text-white";
    } else if (daysRemaining === 0) {
      return "bg-yellow-600 text-white";
    } else {
      return "bg-green-600 text-white";
    }
  };

  const [confirmationInProgress, setConfirmationInProgress] =
    React.useState(false);
  const sendConfirmationRequest = async (id) => {
    try {
      setConfirmationInProgress(true);
      await csrf();
      const response = await axiosClient.put("/api/confirmOrder", {
        order_id: id,
      });
      if (response.status === 200) {
        fetchClients();
      } else {
        throw new Error("Failed to fetch clients");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setConfirmationInProgress(false);
    }
  };

  return isLoading ? (
    <div className="h-72 w-100 rounded-md border animate-pulse"></div>
  ) : (
    <ScrollArea className="h-72 w-full rounded-md border">
  <div className="md:p-4 py-4">
    <h4 className="mb-4 max-md:px-4 text-lg font-medium leading-none py-4">
      Clients crédit
    </h4>
    <table className="min-w-full table-auto">
      <thead className="sticky top-0 bg-gray-100">
        <tr>
          <th className="md:px-4 px-2 py-2 text-sm font-medium">Client</th>
          <th className="md:px-4 px-2 py-2 text-sm font-medium">Téléphone</th>
          <th className="md:px-4 px-2 py-2 text-sm font-medium">Prix reste</th>
          <th className="md:px-4 px-2 py-2 text-sm font-medium">Jours restants</th>
          <th className="md:px-4 px-2 py-2 text-sm font-medium">Confirmation</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client) => {
          const currentDate = new Date();
          const finCreditDate = new Date(client.date_fin_credit);
          const daysRemaining = Math.ceil(
            (finCreditDate - currentDate) / (1000 * 3600 * 24)
          );
          return (
            <tr key={client.id} className="bg-white border-b">
              <td className="md:px-4 px-2 py-2 text-sm">{client.name} {client.lname}</td>
              <td className="md:px-4 px-2 py-2 text-sm">{client.phone}</td>
              <td className="md:px-4 px-2 py-2 text-sm">{client.remain_price}</td>
              <td className="md:px-4 px-2 py-2 text-sm">
                <span
                  className={`px-2 inline-flex text-xs text-center leading-5 font-semibold rounded-full ${getStatusColorClass(client)}`}
                >
                  {daysRemaining} jours
                </span>
              </td>
              <td className="px-4 py-2 text-sm">
                <Dialog>
                  <DialogTrigger>Confirmer</DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Modifier la Commande de {client.name} {client.lname}
                      </DialogTitle>
                      <DialogDescription>
                        Prix reste {client.remain_price}
                      </DialogDescription>
                      <DialogDescription>
                        Cette action ne peut pas être annulée. Êtes-vous sûr de vouloir confirmer définitivement le paiement de cette commande ?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={() => sendConfirmationRequest(client.id)}
                      >
                        {confirmationInProgress ? "Loading..." : "Confirm"}
                      </Button>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</ScrollArea>










  );
}
