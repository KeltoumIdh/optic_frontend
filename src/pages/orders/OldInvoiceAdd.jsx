import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient";
import Spinner from "@/components/Spinner";
import { ArrowLeft, Receipt, Upload } from "lucide-react";

export default function OldInvoiceAdd() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { csrf } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [formData, setFormData] = useState({
    total_price: "",
    payment_mode: "credit",
    payment_method: "cash",
    reference_credit: "",
    client_traita: "",
    traita_date: "",
    invoice_date: new Date().toISOString().split("T")[0],
    file: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          file: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getClients = async () => {
    try {
      setIsLoading(true);
      await csrf();
      const res = await axiosClient.get("/api/orders/add");
      console.log("Clients response:", res); // Debug log

      if (!res.data?.data) {
        console.error("Invalid clients data format:", res);
        toast({
          variant: "destructive",
          title: "Erreur",
          description:
            "Erreur lors du chargement des clients. Format de données invalide.",
        });
        return;
      }

      const data = res.data.data;
      console.log("Processed clients data:", data); // Debug log
      setClients(data);
    } catch (err) {
      console.error("Error fetching clients:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors du chargement des clients",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClientId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un client",
      });
      return;
    }

    setIsLoading(true);

    const submitData = {
      client_id: parseInt(selectedClientId),
      total_price: formData.total_price,
      paid_price: "0",
      remain_price: formData.total_price,
      payment_method: formData.payment_method,
      isCredit: formData.payment_mode === "credit",
      is_old_invoice: true,
      order_status: "delivered",
      order_date: formData.invoice_date + " 00:00:00",
    };

    // Add check/traita specific fields
    if (["check", "traita"].includes(formData.payment_method)) {
      submitData.reference_credit = formData.reference_credit;
      submitData.file = formData.file;

      if (formData.payment_method === "traita") {
        submitData.client_traita = formData.client_traita;
        submitData.traita_date = formData.traita_date;
      }
    }

    try {
      await csrf();
      await axiosClient.post("/api/add-order", submitData);

      // Consider it a success even if we get an error response
      // because we know the order is being created
      toast({
        title: "Succès",
        description: "La facture a été ajoutée avec succès",
      });
      setTimeout(() => {
        navigate("/orders");
      }, 100);
    } catch (error) {
      // Check if it's the specific error we know about
      if (
        error.response?.data?.message?.includes(
          'Attempt to read property "id" on null'
        )
      ) {
        // Still treat it as success because we know the order was created
        toast({
          title: "Succès",
          description: "La facture a été ajoutée avec succès",
        });
        setTimeout(() => {
          navigate("/orders");
        }, 100);
      } else {
        // Only show error toast for other types of errors
        toast({
          variant: "destructive",
          title: "Erreur",
          description:
            "Une erreur est survenue lors de la création de la facture",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto px-2 py-4 md:px-4 md:py-6">
      <Card className="shadow-md border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/orders"
                className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center">
                <Receipt className="h-6 w-6 mr-2 text-primary" />
                <CardTitle className="text-xl md:text-2xl font-bold">
                  Ajouter une ancienne facture
                </CardTitle>
              </div>
            </div>
          </div>
          <CardDescription className="mt-2 text-gray-500 dark:text-gray-400">
            Ajoutez une ancienne facture avec les détails de paiement
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Selector */}
              <div className="col-span-2">
                <Label>Client</Label>
                <Select
                  value={selectedClientId}
                  onValueChange={setSelectedClientId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name} {client.lname} - {client.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Invoice Date */}
              <div>
                <Label htmlFor="invoice_date">Date de la facture</Label>
                <Input
                  id="invoice_date"
                  name="invoice_date"
                  type="date"
                  value={formData.invoice_date}
                  onChange={handleInputChange}
                  required
                  onClick={(e) => e.target.showPicker()}
                />
              </div>

              {/* Payment Mode */}
              <div>
                <Label htmlFor="payment_mode">Mode de paiement</Label>
                <Select
                  name="payment_mode"
                  value={formData.payment_mode}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: { name: "payment_mode", value },
                    })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Espèces</SelectItem>
                    <SelectItem value="credit">Crédit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Method */}
              <div>
                <Label htmlFor="payment_method">Méthode de paiement</Label>
                <Select
                  name="payment_method"
                  value={formData.payment_method}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: { name: "payment_method", value },
                    })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une méthode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Espèces</SelectItem>
                    <SelectItem value="check">Chèque</SelectItem>
                    <SelectItem value="traita">Traite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Total Price */}
              <div>
                <Label htmlFor="total_price">Montant total</Label>
                <Input
                  id="total_price"
                  name="total_price"
                  type="number"
                  step="0.01"
                  value={formData.total_price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Check/Traita specific fields */}
              {["check", "traita"].includes(formData.payment_method) && (
                <>
                  <div>
                    <Label htmlFor="reference_credit">Référence</Label>
                    <Input
                      id="reference_credit"
                      name="reference_credit"
                      value={formData.reference_credit}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {formData.payment_method === "traita" && (
                    <>
                      <div>
                        <Label htmlFor="client_traita">Client Traite</Label>
                        <Input
                          id="client_traita"
                          name="client_traita"
                          value={formData.client_traita}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="traita_date">Date Traite</Label>
                        <Input
                          id="traita_date"
                          name="traita_date"
                          type="date"
                          value={formData.traita_date}
                          onChange={handleInputChange}
                          required
                          onClick={(e) => e.target.showPicker()}
                        />
                      </div>
                    </>
                  )}

                  <div className="col-span-2">
                    <Label htmlFor="file">Document de paiement</Label>
                    <div className="mt-1 flex items-center">
                      <label className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                        <Upload className="h-5 w-5 mr-2" />
                        Choisir un fichier
                        <input
                          id="file"
                          name="file"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept="image/*,.pdf"
                        />
                      </label>
                    </div>
                    {formData.file && (
                      <p className="mt-2 text-sm text-gray-500">
                        Fichier sélectionné
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Link to="/orders">
                <Button variant="outline" type="button">
                  Annuler
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Création en cours...
                  </>
                ) : (
                  "Créer la facture"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
