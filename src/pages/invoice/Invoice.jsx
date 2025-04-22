import { useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
// import "jspdf-autotable";
import * as autoTable from "jspdf-autotable";
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient";
import Spinner from "@/components/Spinner";
import { renderImageDir } from "@/helpers/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Printer,
} from "lucide-react";

export default function Invoice() {
  const { id } = useParams();
  const { csrf } = useAuth();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [companyLogo, setCompanyLogo] = useState("/logo.png");

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        setLoading(true);
        await csrf();
        const response = await axiosClient.get(`/api/orders/details/${id}`);
        setOrder(response.data.order);
        setProducts(response.data.products);
        setClient(response.data.order.client);
      } catch (err) {
        console.error("Error fetching order details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getOrderDetails();
    }
  }, [id, csrf]);

  const downloadPDF = async () => {
    const capture = document.querySelector("#invoice-content");
    if (!capture) return;

    try {
      setGenerating(true);
      const canvas = await html2canvas(capture, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      // Add image
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Save the PDF
      pdf.save(`facture-${order?.id || "commande"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Commande non trouvée</h2>
          <p className="text-gray-600">
            Impossible de trouver les détails de cette commande.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center print:hidden">
          <div className="flex items-center">
            <Link to={`/orders/details/${order.id}`} className="mr-3">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Facture #{order.id}</h1>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handlePrint}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
            <Button
              onClick={downloadPDF}
              disabled={generating}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Download className="mr-2 h-4 w-4" />
              {generating ? "Génération..." : "Télécharger PDF"}
            </Button>
          </div>
        </div>

        <div
          id="invoice-content"
          className="bg-white rounded-lg shadow-lg p-8 print:shadow-none print:p-4"
        >
          {/* Header with Logo and Invoice Info */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-10 pb-6 border-b border-gray-200">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-28 h-28 flex items-center justify-center mr-4 border border-gray-100 rounded-lg overflow-hidden p-2">
                <img
                  className="max-h-full max-w-full object-contain"
                  src={companyLogo}
                  alt="Logo de l'entreprise"
                  onError={(e) => {
                    setCompanyLogo(
                      "https://via.placeholder.com/200x80?text=TYFAWT+OPTIC"
                    );
                    e.target.src =
                      "https://via.placeholder.com/200x80?text=TYFAWT+OPTIC";
                  }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  TYFAWT OPTIC
                </h2>
                <p className="text-gray-600">123 Rue Principale, Casablanca</p>
                <p className="text-gray-600">Tél: +212 5XX XX XX XX</p>
                <p className="text-gray-600">contact@tyfawtoptic.com</p>
              </div>
            </div>
            <div className="text-right bg-gray-50 p-5 rounded-lg border border-gray-200 md:min-w-[200px]">
              <div className="text-3xl font-bold text-gray-800 mb-2">
                FACTURE
              </div>
              <div className="text-gray-600 flex flex-col space-y-1">
                <p>
                  <span className="font-medium">N°:</span> {order.id}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
                <div className="mt-2 flex justify-end">
                  <Badge
                    variant={order.is_credit === 1 ? "destructive" : "success"}
                    className="whitespace-nowrap"
                  >
                    <CreditCard className="h-3 w-3 mr-1" />
                    {order.is_credit === 1 ? "Crédit" : "Payé"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <div className="w-1 h-6 bg-blue-600 mr-2"></div>
              <h3 className="text-lg font-bold">Information Client</h3>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xl font-bold">
                    {client?.name} {client?.lname}
                  </p>
                  <p className="text-gray-600">{client?.address}</p>
                  <p className="text-gray-600">{client?.city}</p>
                </div>
                <div className="md:text-right">
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span>{" "}
                    {client?.email || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Téléphone:</span>{" "}
                    {client?.phone || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">ID Client:</span>{" "}
                    {client?.id || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <div className="w-1 h-6 bg-blue-600 mr-2"></div>
              <h3 className="text-lg font-bold">Détails de la commande</h3>
            </div>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-4 px-4 font-bold border-b">
                      Description
                    </th>
                    <th className="py-4 px-4 font-bold border-b">Référence</th>
                    <th className="py-4 px-4 font-bold border-b text-right">
                      Prix unitaire
                    </th>
                    <th className="py-4 px-4 font-bold border-b text-center">
                      Quantité
                    </th>
                    <th className="py-4 px-4 font-bold border-b text-right">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order?.cart &&
                    JSON.parse(order.cart).productsCart.map((p, index) => {
                      const product = products.find(
                        (product) => product.id === p.product_id
                      );
                      if (!product) return null;

                      return (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }
                        >
                          <td className="py-4 px-4 border-b">{product.name}</td>
                          <td className="py-4 px-4 border-b">
                            {product.reference}
                          </td>
                          <td className="py-4 px-4 border-b text-right">
                            {parseFloat(p.price).toFixed(2)} dh
                          </td>
                          <td className="py-4 px-4 border-b text-center">
                            {p.quantity}
                          </td>
                          <td className="py-4 px-4 border-b text-right font-medium">
                            {(p.price * p.quantity).toFixed(2)} dh
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="mb-8 flex justify-end">
            <div className="w-full md:w-96 bg-gray-50 p-5 rounded-lg border border-gray-200">
              <div className="flex justify-between border-b pb-3 mb-3">
                <span className="font-medium text-gray-600">Sous-total:</span>
                <span className="font-medium">
                  {parseFloat(order.total_price).toFixed(2)} dh
                </span>
              </div>
              {order.is_credit === 1 && (
                <div className="flex justify-between border-b pb-3 mb-3">
                  <span className="font-medium text-gray-600">
                    Montant payé:
                  </span>
                  <span className="font-medium text-green-600">
                    {parseFloat(order.paid_price).toFixed(2)} dh
                  </span>
                </div>
              )}
              {order.is_credit === 1 && order.remain_price !== "0.00" && (
                <div className="flex justify-between border-b pb-3 mb-3">
                  <span className="font-medium text-gray-600">
                    Montant restant:
                  </span>
                  <span className="font-medium text-red-600">
                    {parseFloat(order.remain_price).toFixed(2)} dh
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-lg text-blue-600">
                  {parseFloat(order.total_price).toFixed(2)} dh
                </span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <div className="w-1 h-6 bg-blue-600 mr-2"></div>
              <h3 className="text-lg font-bold">Détails du paiement</h3>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="mb-2">
                    <span className="font-medium">Méthode:</span>{" "}
                    <span className="capitalize">{order.payment_method}</span>
                  </p>
                  {order.reference_credit && (
                    <p className="mb-2">
                      <span className="font-medium">Référence:</span>{" "}
                      {order.reference_credit}
                    </p>
                  )}
                  {order.is_credit === 1 && order.date_fin_credit && (
                    <p className="mb-2">
                      <span className="font-medium">
                        Date de fin de crédit:
                      </span>{" "}
                      {order.date_fin_credit}
                    </p>
                  )}
                </div>
                <div className="md:text-right">
                  <p className="mb-2">
                    <span className="font-medium">Statut de commande:</span>{" "}
                    <Badge
                      variant={
                        order.order_status === "delivered"
                          ? "success"
                          : order.order_status === "canceled"
                          ? "destructive"
                          : "secondary"
                      }
                      className="whitespace-nowrap ml-1"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {order.order_status === "delivered"
                        ? "Livré"
                        : order.order_status === "canceled"
                        ? "Annulé"
                        : "En cours"}
                    </Badge>
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Date de commande:</span>{" "}
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <div className="w-1 h-6 bg-blue-600 mr-2"></div>
              <h3 className="text-lg font-bold">Conditions</h3>
            </div>
            <div className="p-5 rounded-lg border border-gray-200 text-gray-600 text-sm">
              <p className="mb-2">
                1. Les produits vendus ne sont ni repris ni échangés.
              </p>
              <p className="mb-2">2. Paiement dû dans les termes convenus.</p>
              <p className="mb-2">
                3. En cas de crédit, tout retard de paiement entraînera des
                frais supplémentaires.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center bg-gray-50 p-5 rounded-lg border border-gray-200 mt-10">
            <div className="font-bold text-lg mb-2 text-blue-600">
              TYFAWT OPTIC
            </div>
            <p className="text-gray-600 mb-1">
              123 Rue Principale, Casablanca - Tél: +212 5XX XX XX XX
            </p>
            <p className="text-gray-600 mb-3">
              contact@tyfawtoptic.com - www.tyfawtoptic.com
            </p>
            <p className="text-gray-500 text-sm border-t border-gray-200 pt-3">
              Merci pour votre confiance! Cette facture a été générée
              automatiquement.
            </p>
            <p className="text-gray-500 text-sm mt-1">
              © {new Date().getFullYear()} TYFAWT OPTIC - Tous droits réservés
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
