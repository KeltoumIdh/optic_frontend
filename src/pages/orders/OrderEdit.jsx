import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Button } from "../../components/ui/button.jsx";
import { ArrowLeft, Upload, Save, AlertTriangle } from "lucide-react";
import { useToast } from "../../components/ui/use-toast.js";
import { Label } from "../../components/ui/label.jsx";
import SuccessPopup from "../../components/Popups/SuccessPopup.jsx";
import { useAuth } from "@/hooks/useAuth.jsx";
import axiosClient from "@/api/axiosClient.jsx";
import Spinner from "@/components/Spinner.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formSchema = z.object({
  payment_method: z.string().max(50),
  date_fin_credit: z.string().max(50).nullable(),
  paid_price: z.string().max(50),
  remain_price: z.number().min(0),
  total_price: z.number().min(0).optional(),
  // payement_file: z.string().max(50).nullable(),
});

export default function OrderEdit() {
  const { csrf } = useAuth();
  const { id } = useParams();
  const [isCredit, setIsCredit] = useState(false);
  const { toast } = useToast();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();
  const [originalStatus, setOriginalStatus] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [originalOrderData, setOriginalOrderData] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const { setValue } = form;

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        await csrf();
        const response = await axiosClient.post(`/api/orders/edit/${id}`);

        // Store the original order data
        setOriginalOrderData(response.data);

        setValue("payment_method", response.data.payment_method);
        setValue("date_fin_credit", response.data.date_fin_credit);
        setValue("paid_price", response.data.paid_price);
        setValue("remain_price", response.data.remain_price);
        setValue("total_price", response.data.total_price);
        setValue("status", response.data.order_status);
        // setValue("payement_file", response.data.payement_file);
        setIsCredit(response.data.is_credit);

        // Store original status for reference
        setOriginalStatus(response.data.order_status);
        setCurrentStatus(response.data.order_status);
      } catch (error) {
        console.error("Fetch Order Error", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id, setValue]);

  const [file, setFile] = useState("");
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    } else {
      setFile("");
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);

    // If changing to canceled, show confirmation dialog
    if (newStatus === "canceled" && originalStatus !== "canceled") {
      setShowCancelDialog(true);
      e.preventDefault();
      return;
    }

    // If changing from canceled to something else, show restoration dialog
    if (originalStatus === "canceled" && newStatus !== "canceled") {
      setShowRestoreDialog(true);
      e.preventDefault();
      return;
    }

    setValue("status", newStatus);
  };

  const confirmCancellation = () => {
    setValue("status", "canceled");
    setShowCancelDialog(false);
  };

  const confirmRestoration = () => {
    // Continue with the status change
    setValue("status", currentStatus);
    setShowRestoreDialog(false);
  };

  const [inProgress, setInProgress] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      paid_price: e?.target?.paid_price?.value,
      payment_method: e?.target?.payment_method?.value,
      payement_file: file,
      date_fin_credit: e?.target?.date_fin_credit?.value ?? "",
      status: e?.target?.status?.value ?? "",
    };

    // If canceling order, show warning about payment status
    if (data.status === "canceled" && originalStatus !== "canceled") {
      toast({
        title: "Info",
        description:
          "En annulant cette commande, le statut de paiement sera défini comme 'échec'.",
      });
    }

    try {
      setInProgress(true);
      await csrf();
      await axiosClient.put(`/api/orders/update/${id}`, data);
      toast({
        title: "Success",
        description: "Order updated successfully!",
      });
      setShowSuccessPopup(true);
      navigate("/orders");
    } catch (error) {
      console.error("Update Order Error", error);
      toast({
        title: "Error",
        description: "Failed to update order.",
        status: "error",
      });
    } finally {
      setInProgress(false);
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto px-2 py-4 md:px-4 md:py-6">
      <Card className="shadow-md border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3 border-b dark:border-gray-700">
          <div className="flex items-center">
            <Link
              to="/orders"
              className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold">
                Modifier Commande #{id}
              </CardTitle>
              <CardDescription className="mt-1 text-gray-500 dark:text-gray-400">
                Mise à jour des informations de paiement
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-6">
          {originalStatus === "canceled" && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                Cette commande a été annulée. La modification du statut
                rétablira la commande.
              </p>
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={onSubmit}
              className="space-y-5"
              encType="multipart/form-data"
            >
              <div className="grid md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="border rounded-md w-full py-2 px-3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          onChange={handleStatusChange}
                        >
                          <option value="in_delivery">En livraison</option>
                          <option value="delivered">Livré</option>
                          <option value="canceled">Annulé</option>
                          <option value="completed">Terminé</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payment_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Méthode de paiement</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="border rounded-md w-full py-2 px-3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        >
                          <option value="">
                            Sélectionnez une méthode de paiement
                          </option>
                          <option value="cash">Cash</option>
                          <option value="check">Chèque</option>
                          <option value="traita">La Traite</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="paid_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix payé</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Prix payé"
                          {...field}
                          type="number"
                          className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isCredit == 1 && (
                  <FormField
                    control={form.control}
                    name="date_fin_credit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de fin de crédit</FormLabel>
                        <FormControl>
                          <input
                            type="date"
                            {...field}
                            className="border rounded-md w-full py-2 px-3 text-black dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            onClick={(e) => e.target.showPicker()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <Label
                  htmlFor="payement_file"
                  className="block mb-2 font-medium"
                >
                  Fichier de paiement
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="payement_file"
                    name="payement_file"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/png, image/jpg, image/jpeg"
                    className="flex-1 dark:bg-gray-900 dark:border-gray-700"
                  />
                  {file && (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      <Upload className="h-5 w-5 text-gray-600" />
                    </div>
                  )}
                </div>
                {file && (
                  <p className="text-xs text-green-600 mt-2">
                    Image chargée avec succès
                  </p>
                )}
              </div>

              <CardFooter className="flex justify-between px-0 pt-3 pb-0">
                <Button variant="outline" onClick={() => navigate("/orders")}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={inProgress}
                  className="bg-primary hover:bg-primary/90"
                >
                  {!inProgress ? (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Enregistrer
                    </>
                  ) : (
                    <>
                      <Spinner className="mr-2 h-4 w-4" /> Traitement...
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>

      {showSuccessPopup && (
        <SuccessPopup
          message="Commande mise à jour avec succès!"
          onClose={closeSuccessPopup}
        />
      )}

      {/* Cancellation Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'annulation de la commande</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler cette commande ? Cette action
              changera le statut de paiement à "échec" et pourrait affecter
              l'inventaire.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Retour
            </Button>
            <Button variant="destructive" onClick={confirmCancellation}>
              Confirmer l'annulation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restoration Confirmation Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rétablir la commande annulée</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de changer le statut d'une commande
              annulée. Cette action rétablira la commande et pourrait affecter
              l'inventaire et le statut de paiement.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRestoreDialog(false)}
            >
              Annuler
            </Button>
            <Button variant="default" onClick={confirmRestoration}>
              Rétablir la commande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
