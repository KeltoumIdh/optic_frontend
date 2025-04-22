import { FourCard } from "./cards/FourCard";
import { ListCard } from "./cards/listCard";
import ChartCard from "./cards/ChartCard";
import { StockCard } from "./cards/StockProduct";

const Home = () => {
  return (
    <div className=" mx-auto px-2 py-4 md:px-4 md:py-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Dashboard</h1>
      <div className="space-y-4 md:space-y-6">
        <div className="w-full">
          <FourCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-lg shadow-sm">
            <StockCard />
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <ListCard />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-lg shadow-sm">
            <ChartCard />
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            {/* Reserved for future content */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
