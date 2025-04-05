"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { name: "ChargeOn Site", planned: 180, unplanned: 80 },
  { name: "SkyHaus", planned: 250, unplanned: 100 },
  { name: "Ops4 Team", planned: 200, unplanned: 120 },
  { name: "HireX", planned: 70, unplanned: 150 },
  { name: "Pattern50", planned: 190, unplanned: 130 },
  { name: "EVworks", planned: 210, unplanned: 140 },
]

const chartConfig = {
  planned: {
    label: "Planned",
    color: "#1F2937", // Dark gray
  },
  unplanned: {
    label: "Unplanned",
    color: "#C65353", // Red
  },
} satisfies ChartConfig

export function DashBarChart() {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="!pl-0 !pr-1 !pb-0">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            width={500}
            height={200} // Reduced height of the chart
            margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              ticks={[0, 90, 180, 270, 360]}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="planned"
              stackId="a"
              fill="#1F2937"
              radius={[0, 0, 10, 10]}
            />
            <Bar
              dataKey="unplanned"
              stackId="a"
              fill="#C65353"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}