import React, { useState, useEffect } from "react";
import Header from "./Header";
import MarketSelector from "./MarketSelector";
import TimeframeSelector from "./TimeframeSelector";
import SignalPanel from "./SignalPanel";
import { quotexApi } from "../services/quotexApi";

interface Market {
  id: string;
  name: string;
  symbol: string;
  icon?: React.ReactNode;
}

interface Signal {
  id: string;
  direction: "buy" | "sell";
  confidence: number;
  market: string;
  timeframe: string;
  timestamp: Date;
  indicators: {
    rsi: number;
    macd: string;
    bollingerBands: string;
  };
}

const Home = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1m");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load markets from Quotex API
  useEffect(() => {
    const loadMarkets = async () => {
      try {
        setIsLoading(true);
        const marketsData = await quotexApi.getMarkets();
        setMarkets(marketsData);

        // Set default selected market
        if (marketsData.length > 0) {
          setSelectedMarket(marketsData[0]);
        }
      } catch (err) {
        console.error("Error loading markets:", err);
        setError(
          "Failed to load markets. Please check your Quotex API credentials.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadMarkets();
  }, []);

  const handleMarketChange = (market: Market) => {
    setSelectedMarket(market);
  };

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
    // Force regenerate signal with new timeframe
    if (selectedMarket) {
      // This will trigger the useEffect in SignalPanel
      setSelectedMarket({ ...selectedMarket });
    }
  };

  const handleExecuteTrade = (signal: Signal, action: string) => {
    console.log(`Trade ${action} for signal:`, signal);
    // In a real implementation, this would execute the trade via the Quotex API

    if (action === "execute") {
      // Show a notification or alert that the trade was executed
      alert(
        `Trade executed: ${signal.direction.toUpperCase()} ${signal.market}`,
      );

      // In a real implementation, you would call the Quotex API to place the trade
      // quotexApi.executeTrade(signal.market, signal.direction, signal.entryPrice);
    }
  };

  const handleSettingsChange = (settings: any) => {
    console.log("Signal settings changed:", settings);
    // In a real implementation, this would update the AI signal generation parameters

    // Store settings in localStorage for persistence
    localStorage.setItem("signalSettings", JSON.stringify(settings));

    // Force regenerate signal with new settings
    if (selectedMarket) {
      // This will trigger the useEffect in SignalPanel
      setSelectedMarket({ ...selectedMarket });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg">Loading markets from Quotex API...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-red-50 p-6 rounded-lg border border-red-200 max-w-md">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-700 mb-2">
              Connection Error
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-600 text-sm">
              Please check your Quotex API credentials and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <MarketSelector
            markets={markets}
            selectedMarket={selectedMarket || undefined}
            onMarketChange={handleMarketChange}
          />
          <TimeframeSelector
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={handleTimeframeChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="w-full max-w-3xl mx-auto">
            <SignalPanel
              activeMarket={selectedMarket?.name || ""}
              selectedTimeframe={selectedTimeframe}
              onExecuteTrade={handleExecuteTrade}
              onSettingsChange={handleSettingsChange}
            />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>
            AI Signal Generator for Trading Markets ©{" "}
            {new Date().getFullYear()}
          </p>
          <p className="mt-1">
            Powered by Quotex API with high accuracy predictions
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
