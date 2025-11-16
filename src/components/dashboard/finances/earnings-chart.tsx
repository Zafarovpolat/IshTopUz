
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { month: "Март", income: 1860000 },
  { month: "Апрель", income: 3050000 },
  { month: "Май", income: 2370000 },
  { month: "Июнь", income: 730000 },
  { month: "Июль", income: 2090000 },
  { month: "Август", income: 2140000 },
]

const chartConfig = {
  income: {
    label: "Доход (UZS)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function EarningsChart() {
  return (
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
           <CartesianGrid vertical={false} />
           <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
           <YAxis 
            tickFormatter={(value) => `${value / 1000000}M`}
           />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent 
                formatter={(value) => new Intl.NumberFormat('uz-UZ').format(Number(value)) + ' UZS'}
                indicator="dot" 
            />}
          />
          <Bar dataKey="income" fill="var(--color-income)" radius={4} />
        </BarChart>
      </ChartContainer>
  )
}
