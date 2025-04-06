import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { Info } from "lucide-react";

interface SignalSettingsProps {
  sensitivity?: number;
  useRSI?: boolean;
  useMACD?: boolean;
  useBollingerBands?: boolean;
  confidenceThreshold?: number;
  signalFrequency?: string;
  onSettingsChange?: (settings: any) => void;
}

const SignalSettings = ({
  sensitivity = 50,
  useRSI = true,
  useMACD = true,
  useBollingerBands = true,
  confidenceThreshold = 75,
  signalFrequency = "medium",
  onSettingsChange = () => {},
}: SignalSettingsProps) => {
  const [currentSettings, setCurrentSettings] = useState({
    sensitivity,
    useRSI,
    useMACD,
    useBollingerBands,
    confidenceThreshold,
    signalFrequency,
  });

  useEffect(() => {
    setCurrentSettings({
      sensitivity,
      useRSI,
      useMACD,
      useBollingerBands,
      confidenceThreshold,
      signalFrequency,
    });
  }, [
    sensitivity,
    useRSI,
    useMACD,
    useBollingerBands,
    confidenceThreshold,
    signalFrequency,
  ]);

  const handleSensitivityChange = (value: number[]) => {
    const newSettings = { ...currentSettings, sensitivity: value[0] };
    setCurrentSettings(newSettings);
    onSettingsChange(newSettings); // Send the complete settings object
    localStorage.setItem("signalSettings", JSON.stringify(newSettings));
  };

  const handleIndicatorChange = (indicator: string, value: boolean) => {
    const newSettings = { ...currentSettings, [indicator]: value };
    setCurrentSettings(newSettings);
    onSettingsChange(newSettings); // Send the complete settings object
    localStorage.setItem("signalSettings", JSON.stringify(newSettings));
  };

  const handleConfidenceChange = (value: number[]) => {
    const newSettings = { ...currentSettings, confidenceThreshold: value[0] };
    setCurrentSettings(newSettings);
    onSettingsChange(newSettings); // Send the complete settings object
    localStorage.setItem("signalSettings", JSON.stringify(newSettings));
  };

  const handleFrequencyChange = (value: string) => {
    const newSettings = { ...currentSettings, signalFrequency: value };
    setCurrentSettings(newSettings);
    onSettingsChange(newSettings); // Send the complete settings object
    localStorage.setItem("signalSettings", JSON.stringify(newSettings));
  };

  const handleReset = () => {
    const defaultSettings = {
      sensitivity: 50,
      useRSI: true,
      useMACD: true,
      useBollingerBands: true,
      confidenceThreshold: 75,
      signalFrequency: "medium",
    };
    setCurrentSettings(defaultSettings);
    onSettingsChange(defaultSettings);
    localStorage.setItem("signalSettings", JSON.stringify(defaultSettings));
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          Signal Settings
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={handleReset}
          >
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="sensitivity" className="text-sm font-medium">
              Signal Sensitivity
            </Label>
            <span className="text-sm text-gray-500">
              {currentSettings.sensitivity}%
            </span>
          </div>
          <Slider
            id="sensitivity"
            value={[currentSettings.sensitivity]}
            max={100}
            step={1}
            onValueChange={handleSensitivityChange}
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Higher sensitivity generates more signals but may reduce accuracy
          </p>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Technical Indicators</Label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="use-rsi" className="text-sm">
                  RSI
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-60">
                        Relative Strength Index - Measures momentum by comparing
                        recent gains to recent losses
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Switch
                id="use-rsi"
                checked={currentSettings.useRSI}
                onCheckedChange={(checked) =>
                  handleIndicatorChange("useRSI", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="use-macd" className="text-sm">
                  MACD
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-60">
                        Moving Average Convergence Divergence - Trend-following
                        momentum indicator
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Switch
                id="use-macd"
                checked={currentSettings.useMACD}
                onCheckedChange={(checked) =>
                  handleIndicatorChange("useMACD", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="use-bollinger" className="text-sm">
                  Bollinger Bands
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-60">
                        Volatility bands placed above and below a moving average
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Switch
                id="use-bollinger"
                checked={currentSettings.useBollingerBands}
                onCheckedChange={(checked) =>
                  handleIndicatorChange("useBollingerBands", checked)
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="confidence" className="text-sm font-medium">
              Minimum Confidence
            </Label>
            <span className="text-sm text-gray-500">
              {currentSettings.confidenceThreshold}%
            </span>
          </div>
          <Slider
            id="confidence"
            value={[currentSettings.confidenceThreshold]}
            max={100}
            step={5}
            onValueChange={handleConfidenceChange}
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Only show signals with confidence above this threshold
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency" className="text-sm font-medium">
            Signal Frequency
          </Label>
          <Select
            value={currentSettings.signalFrequency}
            onValueChange={handleFrequencyChange}
          >
            <SelectTrigger id="frequency" className="w-full">
              <SelectValue>
                {currentSettings.signalFrequency === "low" &&
                  "Low (Fewer signals, higher quality)"}
                {currentSettings.signalFrequency === "medium" &&
                  "Medium (Balanced)"}
                {currentSettings.signalFrequency === "high" &&
                  "High (More signals, varied quality)"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">
                Low (Fewer signals, higher quality)
              </SelectItem>
              <SelectItem value="medium">Medium (Balanced)</SelectItem>
              <SelectItem value="high">
                High (More signals, varied quality)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => {
            // Apply all settings at once
            onSettingsChange(currentSettings);
            // Save to localStorage
            localStorage.setItem(
              "signalSettings",
              JSON.stringify(currentSettings),
            );
            // Show feedback to user
            alert("Settings applied successfully!");
          }}
        >
          Apply Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default SignalSettings;
