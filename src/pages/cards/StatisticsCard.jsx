import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import Spinner from "@/components/Spinner";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart4,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Always use dummy data since the API endpoint is not working
const DUMMY_DATA = {
  sales: { value: 12500, percentChange: 15.2 },
  orders: { value: 46, percentChange: 8.5 },
  clients: { value: 12, percentChange: 2.1 },
  averageOrder: { value: 271.74, percentChange: -3.7 },
};

const StatisticsCard = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("daily");

  // Simple data loading with simulation of API delay
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Using dummy data for statistics");
      setStatistics(DUMMY_DATA);
      setIsLoading(false);
    }, 700); // Simulate loading delay

    return () => clearTimeout(timer);
  }, [activeTab]);

  // Simulate refreshing data
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Generate slightly different numbers each time to simulate fresh data
      const randomFactor = Math.random() * 0.2 + 0.9; // 0.9-1.1 multiplier

      setStatistics({
        sales: {
          value: Math.round(DUMMY_DATA.sales.value * randomFactor),
          percentChange: +(
            DUMMY_DATA.sales.percentChange * randomFactor
          ).toFixed(1),
        },
        orders: {
          value: Math.round(DUMMY_DATA.orders.value * randomFactor),
          percentChange: +(
            DUMMY_DATA.orders.percentChange * randomFactor
          ).toFixed(1),
        },
        clients: {
          value: Math.round(DUMMY_DATA.clients.value * randomFactor),
          percentChange: +(
            DUMMY_DATA.clients.percentChange * randomFactor
          ).toFixed(1),
        },
        averageOrder: {
          value: Math.round(DUMMY_DATA.averageOrder.value * randomFactor),
          percentChange: +(
            DUMMY_DATA.averageOrder.percentChange * randomFactor
          ).toFixed(1),
        },
      });
      setIsLoading(false);
    }, 700);
  };

  // Format numbers with currency or thousand separators
  const formatNumber = (number, currency = false) => {
    if (currency) {
      return new Intl.NumberFormat(isRTL ? "ar-MA" : "fr-MA", {
        style: "currency",
        currency: "MAD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(number);
    }

    return new Intl.NumberFormat(isRTL ? "ar-MA" : "fr-MA").format(number);
  };

  // Stat card renderer
  const renderStatCard = (title, value, icon, percentChange, bgColor) => {
    const isPositive = percentChange > 0;

    return (
      <Card className={`border shadow-sm ${bgColor} overflow-hidden`}>
        <CardContent className="p-4">
          <div
            className={cn(
              "flex items-center justify-between",
              isRTL && "flex-row-reverse"
            )}
          >
            <div>
              <p
                className={cn(
                  "text-sm font-medium text-gray-500 mb-1",
                  isRTL && "text-right"
                )}
              >
                {title}
              </p>
              <p className={cn("text-2xl font-bold", isRTL && "text-right")}>
                {value}
              </p>

              <div
                className={cn(
                  "flex items-center mt-2",
                  isRTL && "flex-row-reverse justify-end"
                )}
              >
                {percentChange !== undefined && (
                  <>
                    <span
                      className={`inline-flex items-center ${
                        isPositive ? "text-green-600" : "text-red-600"
                      } text-sm font-medium`}
                    >
                      {isPositive ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {isPositive ? "+" : ""}
                      {percentChange}%
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {t("dashboard.statistics.compared")}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className={`p-3 rounded-lg ${bgColor}`}>{icon}</div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Timeframe tabs
  const tabs = [
    { id: "daily", label: t("dashboard.statistics.daily") },
    { id: "weekly", label: t("dashboard.statistics.weekly") },
    { id: "monthly", label: t("dashboard.statistics.monthly") },
  ];

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div
          className={cn(
            "flex items-center justify-between",
            isRTL && "flex-row-reverse"
          )}
        >
          <CardTitle className={cn("text-xl font-bold", isRTL && "text-right")}>
            {t("dashboard.statistics.title")}
          </CardTitle>

          <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1  ">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
                  activeTab === tab.id
                    ? "bg-white text-gray-900 shadow-sm   dark:text-gray-50"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Spinner />
          </div>
        ) : statistics ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderStatCard(
                t("dashboard.statistics.sales"),
                formatNumber(statistics.sales.value, true),
                <DollarSign className="h-6 w-6 text-blue-600" />,
                statistics.sales.percentChange,
                "bg-blue-50"
              )}

              {renderStatCard(
                t("dashboard.statistics.orders"),
                formatNumber(statistics.orders.value),
                <BarChart4 className="h-6 w-6 text-amber-600" />,
                statistics.orders.percentChange,
                "bg-amber-50"
              )}

              {renderStatCard(
                t("dashboard.statistics.clients"),
                formatNumber(statistics.clients.value),
                <PieChart className="h-6 w-6 text-green-600" />,
                statistics.clients.percentChange,
                "bg-green-50"
              )}

              {renderStatCard(
                t("dashboard.statistics.averageOrder"),
                formatNumber(statistics.averageOrder.value, true),
                <DollarSign className="h-6 w-6 text-purple-600" />,
                statistics.averageOrder.percentChange,
                "bg-purple-50"
              )}
            </div>

            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {t("common.refresh") || "Refresh"}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {t("dashboard.statistics.noData")}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
