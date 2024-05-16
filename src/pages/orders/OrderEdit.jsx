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
import { Loader } from "lucide-react";
import OrderApi from "@/services/Api/Orders/OrderApi.jsx";
import { useToast } from "../../components/ui/use-toast.js";
import { Label } from "../../components/ui/label.jsx";
import SuccessPopup from "../../components/Popups/SuccessPopup.jsx";

const formSchema = z.object({
  payment_method: z.string().max(50),
  date_fin_credit: z.string().max(50).nullable(),
  paid_price: z.string().max(50),
  remain_price: z.number().min(0),
  total_price: z.number().min(0).optional(),
  payement_file: z.string().max(50).nullable(),
});

export default function OrderEdit() {
  const { id } = useParams();
  const [isCredit, setIsCredit] = useState(false);
  const { toast } = useToast();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const { handleSubmit, register, setValue, formState } = form;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await OrderApi.edit(id);
        setValue("payment_method", response.data.payment_method);
        setValue("date_fin_credit", response.data.date_fin_credit);
        setValue("paid_price", response.data.paid_price);
        setValue("remain_price", response.data.remain_price);
        setValue("total_price", response.data.total_price);
        setValue("payement_file", response.data.payement_file);
        setIsCredit(response.data.is_credit);
      } catch (error) {
        console.error("Fetch Order Error", error);
      }
    };
    fetchOrder();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    console.log("hello m in");
    console.log("Form data:", data); // Log form data for debugging
    try {
      const response = await OrderApi.update(id, data);
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
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <>
      <div className="flex items-center p-2">
        <Link to={"/orders"} className="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
        <h2 className="md:text-2xl font-semibold dark:text-gray-300">
          Modifier Commande #{id}
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="space-y-3 p-2"
          encType="multipart/form-data"
        >
          <FormField
            control={form.control}
            name="payment_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Méthode de paiement</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="border rounded-md w-full py-2 px-3 bg-white"
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
          {isCredit == 1 && (
            <FormField
              control={form.control}
              name="date_fin_credit"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date de fin de crédit</FormLabel>
                  <FormControl>
                    <input
                      type="date"
                      {...field}
                      className="border rounded-md md:w-1/3 py-2 px-3 text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="payement_file">Fichier de paiement</Label>
            <Input
              id="payement_file"
              name="payement_file"
              type="file"
              {...register("payement_file")}
            />
          </div>
          <FormField
            control={form.control}
            name="paid_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix payé</FormLabel>
                <FormControl>
                  <Input placeholder="Prix payé" {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting && (
              <Loader className={"mx-2 my-2 animate-spin"} />
            )}
            wa Modifier
          </Button>
        </form>
      </Form>
      {showSuccessPopup && (
        <SuccessPopup
          message="Commande mise à jour avec succès!"
          onClose={closeSuccessPopup}
        />
      )}
    </>
  );
}
