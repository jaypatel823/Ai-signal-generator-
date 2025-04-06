import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart2,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import SignalSettings from "./SignalSettings";
import { quotexApi } from "../services/quotexApi";

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

interface SignalPanelProps {
  signals?: Signal[];
  activeMarket?: string;
  selectedTimeframe?: string;
  onExecuteTrade?: (signal: Signal, action: string) => void;
  onSettingsChange?: (settings: any) => void;
}

const SignalPanel = ({
  signals: initialSignals = [],
  activeMarket = "EUR/USD OTC",
  selectedTimeframe = "15m",
  onExecuteTrade = () => {},
  onSettingsChange = () => {},
}: SignalPanelProps) => {
  const [activeTab, setActiveTab] = useState("current");
  const [showSettings, setShowSettings] = useState(false);
  const [signals, setSignals] = useState<Signal[]>(initialSignals);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);

  // Generate a new signal for the active market
  const generateNewSignal = async () => {
    // If cooldown is active, don't generate a new signal
    if (cooldownActive) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Start cooldown period
      setCooldownActive(true);
      setCooldownTimeLeft(60);

      // Extract the market symbol from the active market name
      const marketSymbol = activeMarket.split(" ")[0];
      console.log(
        `Generating signal for market: ${activeMarket} (${marketSymbol})`,
      );

      // Force authentication to ensure we're connected
      const isAuthenticated = await quotexApi.ensureAuthenticated();
      if (!isAuthenticated) {
        throw new Error("Authentication failed. Please try again.");
      }

      console.log("Authentication successful, generating signal...");
      const newSignal = await quotexApi.generateSignal(activeMarket);

      // Add timeframe to the signal
      newSignal.timeframe = timeframe || "1m";

      setSignals((prev) => [newSignal, ...prev]);
      setLastUpdated(new Date());

      // Start countdown timer
      const countdownInterval = setInterval(() => {
        setCooldownTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setCooldownActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error generating signal:", err);
      setError(
        `Failed to generate signal: ${err.message || "Please check your connection."}`,
      );
      // Reset cooldown on error
      setCooldownActive(false);
      setCooldownTimeLeft(0);
      // Auto-retry after 5 seconds
      setTimeout(() => {
        setError(null);
        generateNewSignal();
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  // Update the timeframe state when props change
  const [timeframe, setTimeframe] = useState(selectedTimeframe);

  useEffect(() => {
    setTimeframe(selectedTimeframe);
  }, [selectedTimeframe]);

  // Update timeframe when parent component changes it
  useEffect(() => {
    if (activeMarket) {
      // Reset signals when market changes
      setSignals([]);
    }
  }, [activeMarket]);

  // Auto-refresh signals every 1 minute if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      if (!cooldownActive) {
        generateNewSignal();
      }
    }, 60000); // 1 minute

    return () => clearInterval(intervalId);
  }, [autoRefresh, activeMarket, cooldownActive]);

  // Generate initial signal when active market changes
  useEffect(() => {
    generateNewSignal();
  }, [activeMarket]);

  // Apply stored settings when component mounts
  useEffect(() => {
    const storedSettings = localStorage.getItem("signalSettings");
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings);
        onSettingsChange(settings);
      } catch (error) {
        console.error("Error parsing stored settings:", error);
      }
    }
  }, []);

  // Filter signals for the active market
  const marketSignals = signals.filter(
    (signal) => signal.market === activeMarket,
  );

  // Get the most recent signal
  const latestSignal = marketSignals.length > 0 ? marketSignals[0] : null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "bg-green-100 text-green-800";
    if (confidence >= 70) return "bg-blue-100 text-blue-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      <Card className="flex-1 border shadow-sm bg-white">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">
              AI Signal Generator
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateNewSignal()}
                disabled={loading || cooldownActive}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : cooldownActive ? (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Wait {cooldownTimeLeft}s
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate Signal
                  </>
                )}
              </Button>
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Auto Refresh
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Auto Off
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={toggleSettings}>
                {showSettings ? "Hide Settings" : "Settings"}
              </Button>
            </div>
          </div>
        </CardHeader>

        {showSettings ? (
          <CardContent>
            <SignalSettings onSettingsChange={onSettingsChange} />
          </CardContent>
        ) : (
          <>
            <CardContent className="pb-2">
              <Tabs
                defaultValue="current"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="current">Current Signal</TabsTrigger>
                  <TabsTrigger value="indicators">Indicators</TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="pt-4 space-y-4">
                  {latestSignal ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium">
                            {latestSignal.market}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {latestSignal.timeframe} timeframe
                          </p>
                        </div>
                        <Badge
                          className={getConfidenceColor(
                            latestSignal.confidence,
                          )}
                        >
                          {latestSignal.confidence}% Confidence
                        </Badge>
                      </div>

                      <div className="flex items-center justify-center py-6">
                        {latestSignal.direction === "buy" ? (
                          <div className="flex flex-col items-center">
                            <ArrowUpCircle className="h-20 w-20 text-green-500" />
                            <span className="text-2xl font-bold text-green-600 mt-2">
                              BUY SIGNAL
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <ArrowDownCircle className="h-20 w-20 text-red-500" />
                            <span className="text-2xl font-bold text-red-600 mt-2">
                              SELL SIGNAL
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-center py-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            Real-time Signal{" "}
                            {cooldownActive
                              ? `(Next in ${cooldownTimeLeft}s)`
                              : ""}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          onClick={() =>
                            onExecuteTrade(latestSignal, "execute")
                          }
                        >
                          Execute Trade
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => onExecuteTrade(latestSignal, "ignore")}
                        >
                          Ignore Signal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <AlertCircle className="h-12 w-12 text-gray-400 mb-2" />
                      <h3 className="text-lg font-medium">No Active Signals</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Waiting for AI to generate signals for {activeMarket}
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="indicators" className="pt-4">
                  {latestSignal ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">
                          Technical Analysis
                        </h3>
                        <Badge variant="outline">
                          {latestSignal.timeframe}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 rounded-lg border bg-gray-50">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">RSI</span>
                              <span className="text-sm text-gray-500">
                                (Relative Strength Index)
                              </span>
                            </div>
                            <span
                              className={`font-medium ${latestSignal.indicators.rsi > 70 ? "text-red-600" : latestSignal.indicators.rsi < 30 ? "text-green-600" : "text-gray-600"}`}
                            >
                              {latestSignal.indicators.rsi}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {latestSignal.indicators.rsi > 70
                              ? "Overbought condition - potential reversal"
                              : latestSignal.indicators.rsi < 30
                                ? "Oversold condition - potential reversal"
                                : "Neutral zone"}
                          </p>
                        </div>

                        <div className="p-3 rounded-lg border bg-gray-50">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">MACD</span>
                              <span className="text-sm text-gray-500">
                                (Moving Average Convergence Divergence)
                              </span>
                            </div>
                            {latestSignal.indicators.macd.includes(
                              "bullish",
                            ) ? (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {latestSignal.indicators.macd}
                          </p>
                        </div>

                        <div className="p-3 rounded-lg border bg-gray-50">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                Bollinger Bands
                              </span>
                            </div>
                            <Badge variant="outline">
                              {latestSignal.indicators.bollingerBands}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {latestSignal.indicators.bollingerBands.includes(
                              "upper",
                            )
                              ? "Price is testing upper band - potential resistance"
                              : "Price is testing lower band - potential support"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <AlertCircle className="h-12 w-12 text-gray-400 mb-2" />
                      <h3 className="text-lg font-medium">No Indicator Data</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Waiting for market data to analyze
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="pt-0 pb-4 px-6">
              <div className="w-full text-xs text-gray-500 text-center">
                {error ? (
                  <span className="text-red-500">{error}</span>
                ) : (
                  <>
                    Last updated: {lastUpdated.toLocaleTimeString()}
                    {autoRefresh && " (Auto-refreshing every 1m)"}
                  </>
                )}
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

export default SignalPanel;
