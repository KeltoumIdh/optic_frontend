import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"
import { axiosUser } from "../../api/axios"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "../../components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import axiosClient from "@/api/axiosClient.jsx";



export function ListCard() {

  const { csrf } = useAuth();

  const [clients, setClients] = React.useState([])

  const [isLoading, setisLoading] = React.useState(false)

  React.useEffect(() => {
    const fetchClients = async () => {
      try {
        setisLoading(true)
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
        setisLoading(false)
      }
    };

    fetchClients();
  }, []);

  const getStatusColorClass = (client) => {
    const currentDate = new Date();
    const finCreditDate = new Date(client.date_fin_credit);
    const daysRemaining = Math.ceil((finCreditDate - currentDate) / (1000 * 3600 * 24));

    if (daysRemaining < 0) {
      return "bg-red-600 text-white";
    } else if (daysRemaining === 0) {
      return "bg-yellow-600 text-white";
    } else {
      return "bg-green-600 text-white";
    }
  };

  return isLoading ? <div className="h-72 w-100 rounded-md border animate-pulse"></div> : (
    <ScrollArea className="h-72 w-100 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-lg font-medium leading-none py-4">Clients crédit</h4>
        <div className="flex flex-row justify-between md:px-3">
          <div className="text-sm font-medium">Client</div>
          <div className="text-sm font-medium">Téléphone</div>
          <div className="text-sm font-medium"> prix reste</div>
          <div className="text-sm font-medium">Jours restants</div>
          <div className="text-sm font-medium">confirmation</div>
        </div>
        <Separator className="my-2" />
        {clients.map((client) => {
          const currentDate = new Date();
          const finCreditDate = new Date(client.date_fin_credit);
          const daysRemaining = Math.ceil((finCreditDate - currentDate) / (1000 * 3600 * 24));
          return (
            <div className="">
              <div key={client.id} className='flex flex-row justify-between  px-2'>

                <div className="text-sm">{client.name} {client.lname}</div>
                <div className="text-sm">{client.phone}</div>
                <div className="text-sm">{client.remain_price}</div>
                <div className='text-sm '><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full w-600 ${getStatusColorClass(client)}`}> {daysRemaining} jours</span></div>
                <div>
                  <Dialog>
                    <DialogTrigger>Confirmer</DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Modifier order </DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. Are you sure you want to permanently
                          delete this file from our servers?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button type="submit">Confirm</Button>
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Close
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <Separator className="my-2" />
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
