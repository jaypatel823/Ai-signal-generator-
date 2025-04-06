import React, { useState } from "react";
import { Check, ChevronDown, TrendingUp } from "lucide-react";
import { cn } from "../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

interface Market {
  id: string;
  name: string;
  symbol: string;
  icon?: React.ReactNode;
}

interface MarketSelectorProps {
  markets?: Market[];
  selectedMarket?: Market;
  onMarketChange?: (market: Market) => void;
}

const MarketSelector = ({
  markets = [
    {
      id: "USDBRL",
      name: "USD/BRL OTC",
      symbol: "USDBRL",
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
    },
    {
      id: "USDINR",
      name: "USD/INR OTC",
      symbol: "USDINR",
      icon: <TrendingUp className="h-4 w-4 text-orange-500" />,
    },
    {
      id: "EURUSD",
      name: "EUR/USD OTC",
      symbol: "EURUSD",
      icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
    },
    {
      id: "USDJPY",
      name: "USD/JPY OTC",
      symbol: "USDJPY",
      icon: <TrendingUp className="h-4 w-4 text-red-500" />,
    },
    {
      id: "USDCAD",
      name: "USD/CAD OTC",
      symbol: "USDCAD",
      icon: <TrendingUp className="h-4 w-4 text-indigo-500" />,
    },
    {
      id: "AUDUSD",
      name: "AUD/USD OTC",
      symbol: "AUDUSD",
      icon: <TrendingUp className="h-4 w-4 text-yellow-500" />,
    },
    {
      id: "CHFJPY",
      name: "CHF/JPY OTC",
      symbol: "CHFJPY",
      icon: <TrendingUp className="h-4 w-4 text-purple-500" />,
    },
  ],
  selectedMarket,
  onMarketChange = () => {},
}: MarketSelectorProps) => {
  const [selected, setSelected] = useState<Market>(
    selectedMarket || markets[0],
  );

  const handleMarketSelect = (market: Market) => {
    setSelected(market);
    onMarketChange(market);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm w-[300px]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-medium text-left h-[50px] px-4"
          >
            <div className="flex items-center gap-2">
              {selected.icon}
              <span>{selected.name}</span>
              <span className="text-sm text-muted-foreground ml-2">
                {selected.symbol}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px]" align="start">
          {markets.map((market) => (
            <DropdownMenuItem
              key={market.id}
              className={cn(
                "flex items-center justify-between py-2 cursor-pointer",
                selected.id === market.id && "bg-accent",
              )}
              onClick={() => handleMarketSelect(market)}
            >
              <div className="flex items-center gap-2">
                {market.icon}
                <span>{market.name}</span>
                <span className="text-sm text-muted-foreground ml-1">
                  {market.symbol}
                </span>
              </div>
              {selected.id === market.id && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MarketSelector;
