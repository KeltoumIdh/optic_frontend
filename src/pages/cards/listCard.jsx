import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { CreditCard, Clock, AlertCircle, CheckCircle } from "lucide-react";
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
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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

  const getDaysRemainingInfo = (client) => {
    const currentDate = new Date();
    const finCreditDate = new Date(client.date_fin_credit);
    const daysRemaining = Math.ceil(
      (finCreditDate - currentDate) / (1000 * 3600 * 24)
    );

    if (daysRemaining < 0) {
      return {
        days: daysRemaining,
        colorClass: "bg-rose-100 text-rose-800 border-rose-300",
        icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />,
      };
    } else if (daysRemaining <= 7) {
      return {
        days: daysRemaining,
        colorClass: "bg-amber-100 text-amber-800 border-amber-300",
        icon: <Clock className="h-3.5 w-3.5 mr-1" />,
      };
    } else {
      return {
        days: daysRemaining,
        colorClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
        icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />,
      };
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
        throw new Error("Failed to confirm order");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
    } finally {
      setConfirmationInProgress(false);
    }
  };

  return (
    <Card className="border shadow-none h-full">
      <CardHeader className="pb-2 p-3 md:p-4">
        <div className="flex items-center">
          <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-blue-500 mr-2" />
          <h3 className="text-base md:text-lg font-medium">Clients crédit</h3>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="h-64 w-full rounded-md animate-pulse bg-gray-100"></div>
        ) : (
          <ScrollArea className="h-[260px] md:h-[320px] w-full rounded-md">
            <div className="px-2 md:px-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 md:py-3 px-1 md:px-2 text-left text-xs md:text-sm font-medium text-gray-500">
                        Client
                      </th>
                      <th className="py-2 md:py-3 px-1 md:px-2 text-left text-xs md:text-sm font-medium text-gray-500">
                        Téléphone
                      </th>
                      <th className="py-2 md:py-3 px-1 md:px-2 text-left text-xs md:text-sm font-medium text-gray-500">
                        Prix reste
                      </th>
                      <th className="py-2 md:py-3 px-1 md:px-2 text-left text-xs md:text-sm font-medium text-gray-500">
                        Jours
                      </th>
                      <th className="py-2 md:py-3 px-1 md:px-2 text-left text-xs md:text-sm font-medium text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.length > 0 ? (
                      clients.map((client) => {
                        const { days, colorClass, icon } =
                          getDaysRemainingInfo(client);
                        return (
                          <tr
                            key={client.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm font-medium">
                              {client.name} {client.lname}
                            </td>
                            <td className="py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm text-gray-600">
                              {client.phone}
                            </td>
                            <td className="py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm font-medium">
                              {client.remain_price}.00
                            </td>
                            <td className="py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm">
                              <div
                                className={`inline-flex items-center px-1.5 md:px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}
                              >
                                {icon}
                                <span>{days}</span>
                              </div>
                            </td>
                            <td className="py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-6 md:h-7 px-1.5 md:px-2 rounded-md"
                                  >
                                    Confirmer
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Confirmer le paiement
                                    </DialogTitle>
                                    <DialogDescription className="pt-4">
                                      <div className="space-y-4">
                                        <div className="border rounded-md p-4 bg-gray-50">
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <p className="text-sm text-gray-500">
                                                Client
                                              </p>
                                              <p className="font-medium">
                                                {client.name} {client.lname}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">
                                                Prix reste
                                              </p>
                                              <p className="font-medium">
                                                {client.remain_price}.00
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                          Cette action ne peut pas être annulée.
                                          Êtes-vous sûr de vouloir confirmer
                                          définitivement le paiement de cette
                                          commande ?
                                        </p>
                                      </div>
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter className="flex space-x-2 justify-end">
                                    <DialogClose asChild>
                                      <Button type="button" variant="outline">
                                        Annuler
                                      </Button>
                                    </DialogClose>
                                    <Button
                                      type="submit"
                                      onClick={() =>
                                        sendConfirmationRequest(client.id)
                                      }
                                      disabled={confirmationInProgress}
                                    >
                                      {confirmationInProgress
                                        ? "Chargement..."
                                        : "Confirmer le paiement"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-6 text-center text-gray-500"
                        >
                          Aucun client avec crédit
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
