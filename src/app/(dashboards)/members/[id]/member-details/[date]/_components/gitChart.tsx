"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Minus } from "lucide-react";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

function CustomLegend() {
  return (
    <div className="flex items-center gap-6 mb-4 ml-8">
      <div className="flex items-center gap-2">
        <div className="w-6 h-0.5 bg-green-600"></div>
        <span className="text-sm text-muted-foreground">Addition</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-0.5 bg-red-600"></div>
        <span className="text-sm text-muted-foreground">Deletion</span>
      </div>
    </div>
  );
}

export default function GitChart() {
  return (
    <div className="w-full pt-4">
      <CustomLegend />
      <ChartContainer
        config={{
          addition: {
            label: "Addition",
            color: "hsl(142, 76%, 36%)",
          },
          deletion: {
            label: "Deletion",
            color: "hsl(346, 87%, 43%)",
          },
        }}
        className="max-h-[300px] w-full"
      >
        <LineChart
          accessibilityLayer
          data={[
            { time: "", addition: 0, deletion: 0 },
            { time: "08.00", addition: 0, deletion: 0 },
            { time: "10.00", addition: 500, deletion: -500 },
            { time: "12.00", addition: 400, deletion: -200 },
            { time: "14.00", addition: 300, deletion: -400 },
            { time: "16.00", addition: 900, deletion: -500 },
            { time: "18.00", addition: 200, deletion: -300 },
            { time: "20.00", addition: 100, deletion: -100 },
          ]}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 60,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="4" />
          <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              if (value === 1000) return "1K";
              if (value === 500) return "500";
              if (value === 0) return "0";
              if (value === -500) return "-500";
              if (value === -1000) return "-1K";
              return value;
            }}
            ticks={[1000, 500, 0, -500, -1000]}
            label={{
              value: "Lines of Code",
              angle: -90,
              position: "insideLeft",
              style: {
                textAnchor: "middle",
                fill: "hsl(0, 0%, 50%)",
                fontSize: 12,
              },
            }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="natural" dataKey="addition" stroke="hsl(142, 76%, 36%)" strokeWidth={2} dot={false} />
          <Line type="natural" dataKey="deletion" stroke="hsl(346, 87%, 43%)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </div>
  );
}