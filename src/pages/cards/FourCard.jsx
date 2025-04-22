import { useEffect, useState } from "react";
import { UsersRound, ShoppingBag, GlassesIcon, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient.jsx";
import Spinner from "@/components/Spinner";
import { Link } from "react-router-dom";

export const FourCard = () => {
  const { csrf, authUser } = useAuth();
  const isOwner = authUser?.data?.role === "owner";

  const [totalP, setTotalP] = useState(0);
  const [totalO, setTotalO] = useState(0);
  const [totalC, setTotalC] = useState(0);
  const [totalU, setTotalU] = useState(0);

  const [totalPLoading, setTotalPLoading] = useState(false);
  const [totalOLoading, setTotalOLoading] = useState(false);
  const [totalCLoading, setTotalCLoading] = useState(false);
  const [totalULoading, setTotalULoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setTotalPLoading(true);
        await csrf();
        const response = await axiosClient.get("/api/total/product");
        setTotalP(response.data.total);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du total des produits :",
          error
        );
      } finally {
        setTotalPLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setTotalULoading(true);
        await csrf();
        const response = await axiosClient.get("/api/total/user");
        setTotalU(response.data.total);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du total des users :",
          error
        );
      } finally {
        setTotalULoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setTotalOLoading(true);
        await csrf();
        const response = await axiosClient.get("/api/total/order");
        setTotalO(response.data.total);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du total des commandes :",
          error
        );
      } finally {
        setTotalOLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setTotalCLoading(true);
        await csrf();
        const response = await axiosClient.get("/api/total/client");
        setTotalC(response.data.total);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du total des clients :",
          error
        );
      } finally {
        setTotalCLoading(false);
      }
    })();
  }, []);

  const isLoading =
    totalPLoading || totalOLoading || totalCLoading || totalULoading;

  const statsCards = [
    {
      title: "Clients",
      total: totalC,
      label: "Client",
      icon: <UsersRound className="h-6 w-6 text-blue-600" />,
      link: "/clients",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
    },
    {
      title: "Commandes",
      total: totalO,
      label: "Commande",
      icon: <ShoppingBag className="h-6 w-6 text-amber-600" />,
      link: "/orders",
      bgColor: "bg-amber-50",
      hoverColor: "hover:bg-amber-100",
    },
    {
      title: "Produits",
      total: totalP,
      label: "Produit",
      icon: <GlassesIcon className="h-6 w-6 text-green-600" />,
      link: "/products",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
    },
    {
      title: "Users",
      total: totalU,
      label: "Users",
      icon: <Users className="h-6 w-6 text-purple-600" />,
      link: isOwner ? "/user/list" : "#",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100",
    },
  ];

  return isLoading ? (
    <div className="w-full rounded-md border p-8 flex justify-center items-center">
      <Spinner />
    </div>
  ) : (
    <div className="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6">
      {statsCards.map((card, index) => (
        <Link
          key={index}
          to={card.link}
          className="group transition-all duration-200"
        >
          <Card
            className={`h-full ${card.bgColor} border-none shadow-sm ${card.hoverColor} transition-all duration-200 transform group-hover:scale-[1.02]`}
          >
            <CardHeader className="flex flex-row justify-between items-center pb-2 p-3 md:p-6">
              <h2 className="text-base md:text-xl font-medium group-hover:text-blue-700 transition-colors duration-200">
                {card.title}
              </h2>
              <div className="p-1.5 md:p-2 rounded-full bg-white/70 shadow-sm backdrop-blur-sm">
                {card.icon}
              </div>
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
              <div className="space-y-1">
                <p className="text-xs md:text-sm text-muted-foreground">
                  Total {card.title}
                </p>
                <p className="text-xl md:text-2xl font-bold">
                  {card.total}
                  <span className="text-xs md:text-sm font-normal ml-1 text-muted-foreground">
                    {card.label}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
