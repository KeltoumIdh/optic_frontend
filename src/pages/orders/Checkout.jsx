import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CiMoneyCheck1 } from "react-icons/ci";
import { GiBanknote } from "react-icons/gi";
import { BsCreditCard2Front, BsCalendarDate } from "react-icons/bs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCheckoutStore } from "../../store";
import axiosClient from "@/api/axiosClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  Receipt,
  Loader,
  CheckCircle,
  AlertCircle,
  Upload,
  FileText,
} from "lucide-react";
import Spinner from "@/components/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

function Checkout() {
  const { csrf } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    setisCred,
    setDate: setD,
    setPrixPayee: setPrixP,
    setPrixReste: setPrixR,
    setEtatPayment: setEPa,
    clientId,
    cart,
  } = useCheckoutStore();

  // State variables
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentType, setPaymentType] = useState("surPlace");
  const [isCredit, setIsCredit] = useState(false);
  const [date, setDate] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const [creditReference, setCreditReference] = useState("");
  const [traitaDate, setTraitaDate] = useState("");
  const [traitaForClient, setTraitaForClient] = useState(true);
  const [traitaClient, setTraitaClient] = useState("");
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if cart and client exist
  if (!cart || !cart.productsCart || !clientId) {
    return (
      <div className="mx-auto px-2 py-4 md:px-4 md:py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Informations de commande manquantes. Veuillez retourner à la
            sélection des produits.
          </AlertDescription>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/orders/add")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
        </Alert>
      </div>
    );
  }

  const calculateRemainingAmount = () => {
    const totalAmount = cart.total_price;
    if (paymentType === "credit") {
      return paidAmount ? totalAmount - parseFloat(paidAmount) : totalAmount;
    }
    return 0;
  };

  const [remainingAmount, setRemainingAmount] = useState(
    calculateRemainingAmount()
  );

  const handleCheckout = async () => {
    try {
      // Validation for required fields based on payment method
      if (paymentMethod === "check" && !creditReference) {
        toast({
          title: "Erreur",
          description: "Veuillez saisir le numéro du chèque",
          variant: "destructive",
        });
        return;
      }

      if (paymentMethod === "check" && !file) {
        toast({
          title: "Erreur",
          description: "Veuillez télécharger l'image du chèque",
          variant: "destructive",
        });
        return;
      }

      if (paymentMethod === "traita") {
        if (!creditReference) {
          toast({
            title: "Erreur",
            description: "Veuillez saisir le numéro de la traite",
            variant: "destructive",
          });
          return;
        }

        if (!traitaDate) {
          toast({
            title: "Erreur",
            description: "Veuillez saisir la date d'échéance",
            variant: "destructive",
          });
          return;
        }

        if (!traitaForClient && !traitaClient) {
          toast({
            title: "Erreur",
            description: "Veuillez saisir le nom sur la traite",
            variant: "destructive",
          });
          return;
        }

        if (!file) {
          toast({
            title: "Erreur",
            description: "Veuillez télécharger l'image de la traite",
            variant: "destructive",
          });
          return;
        }
      }

      // For credit, validate date is selected
      if (paymentType === "credit" && !date) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner une date de fin de crédit",
          variant: "destructive",
        });
        return;
      }

      const formData = {
        client_id: clientId,
        cart: cart,
        isCredit: paymentType === "credit",
        payment_method: paymentMethod,
        date_fin_credit: paymentType === "credit" ? date : null,
        paid_price:
          paymentType !== "credit"
            ? cart.total_price
            : isNaN(paidAmount) || paidAmount === ""
            ? 0
            : parseFloat(paidAmount).toFixed(2),
        remain_price: remainingAmount || 0,
        total_price: cart.total_price,
        reference_credit:
          paymentMethod === "check" || paymentMethod === "traita"
            ? creditReference
            : "",
        file: file,
        client_traita:
          paymentMethod === "traita" && !traitaForClient ? traitaClient : "",
        traita_date: paymentMethod === "traita" ? traitaDate : null,
      };

      setLoading(true);
      await csrf();
      await axiosClient.post("/api/add-order", formData);

      toast({
        title: "Succès",
        description: "La commande a été créée avec succès !",
        variant: "success",
      });

      navigate("/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la création de la commande.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const updatedRemainingAmount = calculateRemainingAmount();
    setRemainingAmount(updatedRemainingAmount);

    // Update store values
    setisCred(isCredit);
    setEPa(paymentType);
    setD(date);
    setPrixP(paidAmount);
    setPrixR(remainingAmount);
  }, [paidAmount, paymentType, isCredit, date, cart.total_price]);

  // Add a function to handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  if (loading) {
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
              to="/orders/confirmed"
              state={{
                selectedProducts: cart.productsCart.map((p) => p.product_id),
                clientId,
              }}
              className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center">
              <Receipt className="h-6 w-6 mr-2 text-primary" />
              <CardTitle className="text-xl md:text-2xl font-bold">
                Finaliser la commande
              </CardTitle>
            </div>
          </div>
          <CardDescription className="mt-2 text-gray-500 dark:text-gray-400">
            Choisissez les options de paiement et finalisez la commande
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* PAYMENT OPTIONS COLUMN */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Mode de paiement</h3>

                <RadioGroup
                  value={paymentType}
                  onValueChange={setPaymentType}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit" id="credit" />
                    <Label
                      htmlFor="credit"
                      className="flex items-center cursor-pointer"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Crédit
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="surPlace" id="surPlace" />
                    <Label
                      htmlFor="surPlace"
                      className="flex items-center cursor-pointer"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Paiement sur place
                    </Label>
                  </div>
                </RadioGroup>

                {paymentType === "credit" && (
                  <div className="mt-6 pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="paidAmount">Montant payé</Label>
                      <Input
                        id="paidAmount"
                        type="number"
                        min="0"
                        max={cart.total_price}
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="creditDate">Date de fin de crédit</Label>
                      <input
                        type="date"
                        value={date || ""}
                        onChange={(e) => setDate(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                        onClick={(e) => e.target.showPicker()}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">
                  Méthode de paiement
                </h3>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label
                      htmlFor="cash"
                      className="flex items-center cursor-pointer"
                    >
                      <Banknote className="h-4 w-4 mr-2" />
                      Espèces
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="check" id="check" />
                    <Label
                      htmlFor="check"
                      className="flex items-center cursor-pointer"
                    >
                      <CiMoneyCheck1 className="h-4 w-4 mr-2" />
                      Chèque
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="traita" id="traita" />
                    <Label
                      htmlFor="traita"
                      className="flex items-center cursor-pointer"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Traite
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "check" && (
                  <div className="mt-6 pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="referenceCheck">Numéro du chèque</Label>
                      <Input
                        id="referenceCheck"
                        value={creditReference}
                        onChange={(e) => setCreditReference(e.target.value)}
                        placeholder="Numéro du chèque"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="checkImage">Image du chèque</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="checkImage"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="flex-1"
                        />
                        {file && (
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                            <Upload className="h-5 w-5 text-gray-600" />
                          </div>
                        )}
                      </div>
                      {file && (
                        <p className="text-xs text-green-600">
                          Image chargée avec succès
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {paymentMethod === "traita" && (
                  <div className="mt-6 pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="referenceTraita">
                        Numéro de la traite
                      </Label>
                      <Input
                        id="referenceTraita"
                        value={creditReference}
                        onChange={(e) => setCreditReference(e.target.value)}
                        placeholder="Numéro de la traite"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="traitaDate">Date d'échéance</Label>
                      <input
                        type="date"
                        value={traitaDate || ""}
                        onChange={(e) => setTraitaDate(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                        onClick={(e) => e.target.showPicker()}
                      />
                    </div>

                    <div className="flex items-center space-x-2 my-4">
                      <Checkbox
                        id="traitaForClient"
                        checked={traitaForClient}
                        onCheckedChange={setTraitaForClient}
                      />
                      <Label htmlFor="traitaForClient">
                        La traite est pour le même client
                      </Label>
                    </div>

                    {!traitaForClient && (
                      <div className="space-y-2">
                        <Label htmlFor="traitaClient">Nom sur la traite</Label>
                        <Input
                          id="traitaClient"
                          value={traitaClient}
                          onChange={(e) => setTraitaClient(e.target.value)}
                          placeholder="Nom du titulaire"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="traitaImage">Image de la traite</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="traitaImage"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="flex-1"
                        />
                        {file && (
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                            <Upload className="h-5 w-5 text-gray-600" />
                          </div>
                        )}
                      </div>
                      {file && (
                        <p className="text-xs text-green-600">
                          Image chargée avec succès
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ORDER SUMMARY COLUMN */}
            <div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">
                  Récapitulatif de la commande
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{parseFloat(cart.total_price).toFixed(2)} dh</span>
                  </div>

                  {paymentType === "credit" && paidAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Montant payé</span>
                      <span>-{parseFloat(paidAmount).toFixed(2)} dh</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>{parseFloat(cart.total_price).toFixed(2)} dh</span>
                  </div>

                  {paymentType === "credit" && (
                    <div className="flex justify-between font-medium text-red-600">
                      <span>Montant restant</span>
                      <span>{parseFloat(remainingAmount).toFixed(2)} dh</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Produits</h3>

                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {cart.productsCart &&
                    cart.productsCart.map((product, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b dark:border-gray-700"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            {product.quantity} x{" "}
                            {parseFloat(product.price).toFixed(2)} dh
                          </div>
                        </div>
                        <div className="font-medium">
                          {(product.quantity * product.price).toFixed(2)} dh
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-4 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={() =>
              navigate("/orders/confirmed", {
                state: {
                  selectedProducts: cart.productsCart.map((p) => p.product_id),
                  clientId,
                },
              })
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>

          <Button
            onClick={handleCheckout}
            className="bg-primary hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" /> Traitement...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" /> Confirmer la commande
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Checkout;
