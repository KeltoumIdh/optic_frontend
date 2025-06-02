import { FourCard } from "./cards/FourCard";
import { ListCard } from "./cards/listCard";
import ChartCard from "./cards/ChartCard";
import { StockCard } from "./cards/StockProduct";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const Home = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div
      className={cn("mx-auto px-2 py-4 md:px-4 md:py-6", isRTL && "text-right")}
    >
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
        {t("dashboard.title")}
      </h1>
      <div className="space-y-4 md:space-y-6">
        <div className="w-full">
          <FourCard />
        </div>

        <div className="w-full">
          <ListCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-lg shadow-sm">
            <StockCard />
          </div>
          <div className="bg-white rounded-lg shadow-sm">
            <ChartCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
