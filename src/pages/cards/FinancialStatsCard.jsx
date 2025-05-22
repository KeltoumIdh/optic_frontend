import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import Spinner from "@/components/Spinner";
import OrderApi from "@/services/Api/Orders/OrderApi";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  Clock,
  RefreshCw,
  PieChart,
  Calendar,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FinancialStatsCard = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState("today");
  const [error, setError] = useState(null);

  // Timeframe options with labels and values
  const timeframeOptions = [
    { id: "today", label: t("dashboard.timeframes.today") },
    { id: "yesterday", label: t("dashboard.timeframes.yesterday") },
    { id: "this_week", label: t("dashboard.timeframes.this_week") },
    { id: "last_week", label: t("dashboard.timeframes.last_week") },
    { id: "this_month", label: t("dashboard.timeframes.this_month") },
    { id: "last_month", label: t("dashboard.timeframes.last_month") },
    { id: "this_year", label: t("dashboard.timeframes.this_year") },
    { id: "last_year", label: t("dashboard.timeframes.last_year") },
    { id: "all_time", label: t("dashboard.timeframes.all_time") },
  ];

  // Get timeframe label for display
  const getTimeframeLabel = (id) => {
    const option = timeframeOptions.find((option) => option.id === id);
    return option ? option.label : id;
  };

  // Format numbers with currency or thousand separators
  const formatNumber = (number, currency = false) => {
    if (number === undefined || number === null) return "-";

    const formatter = new Intl.NumberFormat(i18n.language, {
      style: currency ? "currency" : "decimal",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return formatter.format(number);
  };

  // Fetch financial statistics using OrderApi service
  const fetchFinancialStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert 'all_time' to 'all' for the API call
      const timeframe =
        activeTimeframe === "all_time" ? "all" : activeTimeframe;
      const data = await OrderApi.getFinancialStats(timeframe);

      // Transform the statistics data to match our expected format
      const transformedData = {
        totalRevenue: {
          value: data.totalRevenue?.value || 0,
          percentChange: data.totalRevenue?.percentChange || 0,
        },
        paidAmount: {
          value: data.paidAmount?.value || 0,
          percentChange: data.paidAmount?.percentChange || 0,
        },
        pendingAmount: {
          value: data.pendingAmount?.value || 0,
          percentChange: data.pendingAmount?.percentChange || 0,
        },
        paymentCompletionRate: data.paymentCompletionRate || 0,
        orderCounts: {
          total: data.orderCounts?.total || 0,
          completed: data.orderCounts?.completed || 0,
          pending: data.orderCounts?.pending || 0,
        },
      };

      setStatistics(transformedData);
    } catch (error) {
      console.error("Error fetching financial stats:", error);
      setError(t("dashboard.finances.fetch_error"));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle timeframe selection
  const handleTimeframeChange = (timeframe) => {
    setActiveTimeframe(timeframe);
    // fetchFinancialStats will be called via useEffect when activeTimeframe changes
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchFinancialStats();
  }, [activeTimeframe]);

  // Handle refresh button click
  const handleRefresh = () => {
    fetchFinancialStats();
  };

  // Render a single stat card with icon and trend
  const renderStatCard = (title, value, percentChange, icon, colorClass) => {
    const Icon = icon;
    const isPositive = percentChange > 0;
    const isNeutral = percentChange === 0;

    return (
      <div className="rounded-lg bg-white   p-4 shadow border">
        <div
          className={cn(
            "flex items-center mb-2",
            isRTL && "flex-row-reverse justify-between"
          )}
        >
          <div
            className={cn(
              "p-2 rounded-full",
              colorClass || "bg-blue-100 dark:bg-blue-900"
            )}
          >
            <Icon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          </div>
          {percentChange !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
                isPositive
                  ? "text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300"
                  : isNeutral
                  ? "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                  : "text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : isNeutral ? (
                <Clock className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{Math.abs(percentChange)}%</span>
            </div>
          )}
        </div>
        <h3
          className={cn(
            "text-sm font-medium text-gray-500 dark:text-gray-400 mb-1",
            isRTL && "text-right"
          )}
        >
          {title}
        </h3>
        <p className={cn("text-2xl font-bold", isRTL && "text-right")}>
          {value}
        </p>
      </div>
    );
  };

  // Render progress card for payment completion rate
  const renderProgressCard = (rate) => {
    return (
      <div className="rounded-lg bg-white   p-4 shadow border">
        <div
          className={cn(
            "flex items-center mb-2",
            isRTL && "flex-row-reverse justify-between"
          )}
        >
          <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
            <PieChart className="h-5 w-5 text-purple-600 dark:text-purple-300" />
          </div>
        </div>
        <h3
          className={cn(
            "text-sm font-medium text-gray-500 dark:text-gray-400 mb-1",
            isRTL && "text-right"
          )}
        >
          {t("dashboard.finances.completion_rate")}
        </h3>
        <p className={cn("text-2xl font-bold", isRTL && "text-right")}>
          {rate}%
        </p>
        <div className="mt-3 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-2.5 rounded-full bg-purple-600 dark:bg-purple-400"
            style={{ width: `${rate}%` }}
          ></div>
        </div>
      </div>
    );
  };

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
            {t("dashboard.finances.title")}
          </CardTitle>

          <div className="flex items-center gap-2">
            {/* Timeframe dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{getTimeframeLabel(activeTimeframe)}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {timeframeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => handleTimeframeChange(option.id)}
                    className={cn(
                      "cursor-pointer",
                      activeTimeframe === option.id && "bg-gray-100  "
                    )}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Refresh button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              className="h-9 w-9"
              title={t("common.refresh")}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-48 text-red-500 gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        ) : statistics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Revenue */}
            {renderStatCard(
              t("dashboard.finances.total_revenue"),
              formatNumber(statistics.totalRevenue?.value, true),
              statistics.totalRevenue?.percentChange,
              DollarSign,
              "bg-green-100 dark:bg-green-900"
            )}

            {/* Paid Amount */}
            {renderStatCard(
              t("dashboard.finances.paid_amount"),
              formatNumber(statistics.paidAmount?.value, true),
              statistics.paidAmount?.percentChange,
              Wallet,
              "bg-blue-100 dark:bg-blue-900"
            )}

            {/* Pending Amount */}
            {renderStatCard(
              t("dashboard.finances.pending_amount"),
              formatNumber(statistics.pendingAmount?.value, true),
              statistics.pendingAmount?.percentChange,
              Clock,
              "bg-orange-100 dark:bg-orange-900"
            )}

            {/* Payment Completion Rate */}
            {renderProgressCard(statistics.paymentCompletionRate || 0)}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default FinancialStatsCard;
