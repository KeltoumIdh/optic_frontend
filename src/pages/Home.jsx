import React from "react";
import { FourCard } from "./cards/FourCard";
import { ListCard } from "./cards/listCard";
import ChartCard from "./cards/ChartCard";
import { StockCard } from "./cards/StockProduct";

const Home = () => {
  return (
    <div className="w-full">
      <div className="md:m-2 flex flex-col justify-between items-start gap-2 w-full md:w-[calc(100 - 5)] ">
        <div className="h-auto mb-2 w-full">
          <FourCard />
        </div>
        <div className="h-auto w-full grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="flex flex-col h-auto ">
            <StockCard />
          </div>

          <div className="flex flex-col h-auto ">
            <ListCard />
          </div>
        </div>
        <div className="h-auto w-full grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="flex flex-col h-auto ">
            <ChartCard />
          </div>

          <div className="flex flex-col h-auto ">{/* <ListCard /> */}</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
