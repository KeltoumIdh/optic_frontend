import { useEffect, useState } from "react";
import { UsersRound, ShoppingBag, GlassesIcon, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient.jsx";
import Spinner from "@/components/Spinner";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export const FourCard = () => {
  const { csrf, authUser } = useAuth();
  const isOwner = authUser?.data?.role === "owner";
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

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
      title: t("dashboard.totalClients"),
      total: totalC,
      label: t("dashboard.client"),
      labelText: t("dashboard.metrics.totalClientsLabel"),
      icon: <UsersRound className="h-6 w-6 text-blue-600" />,
      link: "/clients",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
    },
    {
      title: t("dashboard.totalOrders"),
      total: totalO,
      label: t("dashboard.order"),
      labelText: t("dashboard.metrics.totalOrdersLabel"),
      icon: <ShoppingBag className="h-6 w-6 text-amber-600" />,
      link: "/orders",
      bgColor: "bg-amber-50",
      hoverColor: "hover:bg-amber-100",
    },
    {
      title: t("dashboard.totalProducts"),
      total: totalP,
      label: t("dashboard.product"),
      labelText: t("dashboard.metrics.totalProductsLabel"),
      icon: <GlassesIcon className="h-6 w-6 text-green-600" />,
      link: "/products",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
    },
    {
      title: t("dashboard.totalUsers"),
      total: totalU,
      label: t("dashboard.users"),
      labelText: t("dashboard.metrics.totalUsersLabel"),
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
    <div
      className={cn(
        "grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6",
        isRTL && "direction-rtl"
      )}
    >
      {statsCards.map((card, index) => (
        <Link
          key={index}
          to={card.link}
          className="group transition-all duration-200"
        >
          <Card
            className={`h-full ${card.bgColor} border-none shadow-sm ${card.hoverColor} transition-all duration-200 transform group-hover:scale-[1.02]`}
          >
            <CardHeader
              className={cn(
                "flex flex-row items-center pb-2 p-3 md:p-6",
                isRTL ? "flex-row-reverse justify-between" : "justify-between"
              )}
            >
              <h2
                className={cn(
                  "text-base md:text-xl font-medium group-hover:text-blue-700 transition-colors duration-200",
                  isRTL && "text-right"
                )}
              >
                {card.title}
              </h2>
              <div className="p-1.5 md:p-2 rounded-full bg-white/70 shadow-sm backdrop-blur-sm">
                {card.icon}
              </div>
            </CardHeader>
            <CardContent
              className={cn("p-3 md:p-6 pt-0 md:pt-0", isRTL && "text-right")}
            >
              <div className="space-y-1">
                <p className="text-xs md:text-sm text-muted-foreground">
                  {card.labelText}
                </p>
                <p
                  className={cn(
                    "text-xl md:text-2xl font-bold",
                    isRTL && "flex flex-row-reverse items-center gap-1"
                  )}
                >
                  {card.total}
                  <span
                    className={cn(
                      "text-xs md:text-sm font-normal text-muted-foreground",
                      isRTL ? "mr-1" : "ml-1"
                    )}
                  >
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
