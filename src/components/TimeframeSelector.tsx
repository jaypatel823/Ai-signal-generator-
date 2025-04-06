import React from "react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface TimeframeSelectorProps {
  timeframes?: string[];
  selectedTimeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
}

const TimeframeSelector = ({
  timeframes = ["1m", "5m"],
  selectedTimeframe = "1m",
  onTimeframeChange = () => {},
}: TimeframeSelectorProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-background rounded-md border">
      <span className="text-sm font-medium mr-2">Timeframe:</span>
      <div className="flex flex-wrap gap-1">
        {timeframes.map((timeframe) => (
          <Button
            key={timeframe}
            variant={selectedTimeframe === timeframe ? "default" : "outline"}
            size="sm"
            onClick={() => onTimeframeChange(timeframe)}
            className={cn(
              "min-w-[40px]",
              selectedTimeframe === timeframe &&
                "bg-primary text-primary-foreground",
            )}
          >
            {timeframe}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TimeframeSelector;
