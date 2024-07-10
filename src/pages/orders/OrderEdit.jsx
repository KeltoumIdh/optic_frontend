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
import { useToast } from "../../components/ui/use-toast.js";
import { Label } from "../../components/ui/label.jsx";
import SuccessPopup from "../../components/Popups/SuccessPopup.jsx";
import { useAuth } from "@/hooks/useAuth.jsx";
import axiosClient from "@/api/axiosClient.jsx";
import Spinner from "@/components/Spinner.jsx";


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

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const { handleSubmit, register, setValue, formState } = form;

  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true)
        await csrf();
        const response = await axiosClient.post(`/api/orders/edit/${id}`);
        setValue("payment_method", response.data.payment_method);
        setValue("date_fin_credit", response.data.date_fin_credit);
        setValue("paid_price", response.data.paid_price);
        setValue("remain_price", response.data.remain_price);
        setValue("total_price", response.data.total_price);
        // setValue("payement_file", response.data.payement_file);
        setIsCredit(response.data.is_credit);
      } catch (error) {
        console.error("Fetch Order Error", error);
      } finally {
        setIsLoading(false)
      }
    };
    fetchOrder();
  }, [id, setValue]);


  const [file, setFile] = useState("")
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    } else {
      setFile('')
    }
  }


  const [inProgress, setInProgress] = useState(false)
  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      paid_price: e?.target?.paid_price?.value,
      payment_method: e?.target?.payment_method?.value,
      payement_file: file,
      date_fin_credit: e?.target?.date_fin_credit?.value ?? "",
    };

    try {
      setInProgress(true)
      await csrf();
      const response = await axiosClient.put(`/api/orders/update/${id}`, data);
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
      setInProgress(false)
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return isLoading ? <Spinner/> : (
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
              onChange={handleFileChange}
              accept="image/png, image/jpg, image/jpeg"
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

          <Button type="submit" disabled={inProgress}>
            {!inProgress ? 'Modifier' : 'Loading...'}
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
