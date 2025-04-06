import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  LineChart,
  BarChart2,
  CandlestickChart,
  Activity,
  Eye,
} from "lucide-react";

interface ChartContainerProps {
  marketData?: {
    candles: Array<{
      time: string;
      open: number;
      high: number;
      close: number;
      low: number;
    }>;
    indicators?: {
      rsi: number;
      macd: number;
      ema: number;
    };
  };
  signals?: Array<{
    time: string;
    direction: "buy" | "sell";
    confidence: number;
    price: number;
  }>;
  onIndicatorToggle?: (indicator: string, enabled: boolean) => void;
}

const ChartContainer = ({
  marketData = {
    candles: [
      {
        time: "2023-06-01 09:00",
        open: 150.2,
        high: 152.5,
        close: 151.8,
        low: 149.5,
      },
      {
        time: "2023-06-01 09:05",
        open: 151.8,
        high: 153.2,
        close: 152.5,
        low: 151.0,
      },
      {
        time: "2023-06-01 09:10",
        open: 152.5,
        high: 154.0,
        close: 153.2,
        low: 152.0,
      },
      {
        time: "2023-06-01 09:15",
        open: 153.2,
        high: 155.5,
        close: 154.8,
        low: 153.0,
      },
      {
        time: "2023-06-01 09:20",
        open: 154.8,
        high: 156.2,
        close: 155.5,
        low: 154.0,
      },
      {
        time: "2023-06-01 09:25",
        open: 155.5,
        high: 157.0,
        close: 156.2,
        low: 155.0,
      },
      {
        time: "2023-06-01 09:30",
        open: 156.2,
        high: 158.5,
        close: 157.8,
        low: 156.0,
      },
    ],
    indicators: {
      rsi: 65,
      macd: 0.75,
      ema: 155.2,
    },
  },
  signals = [
    {
      time: "2023-06-01 09:10",
      direction: "buy",
      confidence: 87,
      price: 152.8,
    },
    {
      time: "2023-06-01 09:25",
      direction: "sell",
      confidence: 92,
      price: 156.5,
    },
  ],
  onIndicatorToggle = () => {},
}: ChartContainerProps) => {
  const [chartType, setChartType] = useState("candlestick");
  const [activeIndicators, setActiveIndicators] = useState({
    rsi: true,
    macd: true,
    ema: true,
    volume: false,
    bollinger: false,
  });

  const toggleIndicator = (indicator: string) => {
    setActiveIndicators((prev) => {
      const newState = {
        ...prev,
        [indicator]: !prev[indicator as keyof typeof prev],
      };
      onIndicatorToggle(
        indicator,
        newState[indicator as keyof typeof newState],
      );
      return newState;
    });
  };

  // This would be replaced with an actual chart library implementation
  const renderChart = () => {
    return (
      <div className="w-full h-[400px] bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center relative">
        {chartType === "candlestick" && (
          <div className="absolute inset-0 p-4">
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 border-b border-slate-300 dark:border-slate-700 relative">
                {/* Placeholder for candlestick chart */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <CandlestickChart className="w-16 h-16 text-slate-400" />
                  <span className="ml-2 text-slate-500">
                    Candlestick Chart Visualization
                  </span>
                </div>

                {/* Signal markers */}
                {signals.map((signal, index) => (
                  <div
                    key={index}
                    className={`absolute ${signal.direction === "buy" ? "bottom-1/4" : "top-1/4"} right-[${index * 10 + 20}%]`}
                  >
                    {signal.direction === "buy" ? (
                      <ArrowUpCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <ArrowDownCircle className="w-6 h-6 text-red-500" />
                    )}
                    <div className="absolute -top-8 -left-10 bg-black/80 text-white text-xs p-1 rounded">
                      {signal.confidence}% confidence
                    </div>
                  </div>
                ))}
              </div>

              {/* Indicator area */}
              {activeIndicators.rsi && (
                <div className="h-[80px] mt-2 border-b border-slate-300 dark:border-slate-700 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-500 mr-2" />
                    <span className="text-xs text-slate-500">
                      RSI: {marketData.indicators?.rsi}
                    </span>
                  </div>
                </div>
              )}

              {activeIndicators.macd && (
                <div className="h-[80px] mt-2 border-b border-slate-300 dark:border-slate-700 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BarChart2 className="w-6 h-6 text-purple-500 mr-2" />
                    <span className="text-xs text-slate-500">
                      MACD: {marketData.indicators?.macd}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {chartType === "line" && (
          <div className="flex items-center justify-center">
            <LineChart className="w-16 h-16 text-slate-400" />
            <span className="ml-2 text-slate-500">
              Line Chart Visualization
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full bg-white dark:bg-slate-900">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Market Chart</CardTitle>
        <div className="flex space-x-2">
          <Select defaultValue="1m">
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Minute</SelectItem>
              <SelectItem value="5m">5 Minutes</SelectItem>
              <SelectItem value="15m">15 Minutes</SelectItem>
              <SelectItem value="30m">30 Minutes</SelectItem>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="4h">4 Hours</SelectItem>
              <SelectItem value="1d">1 Day</SelectItem>
            </SelectContent>
          </Select>

          <Tabs defaultValue="candlestick" onValueChange={setChartType}>
            <TabsList>
              <TabsTrigger value="candlestick">
                <CandlestickChart className="w-4 h-4 mr-1" />
                Candles
              </TabsTrigger>
              <TabsTrigger value="line">
                <LineChart className="w-4 h-4 mr-1" />
                Line
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 text-xs rounded-full flex items-center ${activeIndicators.rsi ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}
            onClick={() => toggleIndicator("rsi")}
          >
            <Activity className="w-3 h-3 mr-1" />
            RSI
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-full flex items-center ${activeIndicators.macd ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}
            onClick={() => toggleIndicator("macd")}
          >
            <BarChart2 className="w-3 h-3 mr-1" />
            MACD
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-full flex items-center ${activeIndicators.ema ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}
            onClick={() => toggleIndicator("ema")}
          >
            <LineChart className="w-3 h-3 mr-1" />
            EMA
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-full flex items-center ${activeIndicators.volume ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}
            onClick={() => toggleIndicator("volume")}
          >
            <BarChart2 className="w-3 h-3 mr-1" />
            Volume
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-full flex items-center ${activeIndicators.bollinger ? "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}
            onClick={() => toggleIndicator("bollinger")}
          >
            <Eye className="w-3 h-3 mr-1" />
            Bollinger
          </button>
        </div>

        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
          <h4 className="text-sm font-medium mb-2">Latest Signals</h4>
          <div className="space-y-2">
            {signals.map((signal, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center">
                  {signal.direction === "buy" ? (
                    <ArrowUpCircle className="w-4 h-4 text-green-500 mr-2" />
                  ) : (
                    <ArrowDownCircle className="w-4 h-4 text-red-500 mr-2" />
                  )}
                  <span
                    className={
                      signal.direction === "buy"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {signal.direction === "buy" ? "Buy" : "Sell"} at{" "}
                    {signal.price}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-slate-500 mr-2">
                    {signal.time}
                  </span>
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {signal.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartContainer;
