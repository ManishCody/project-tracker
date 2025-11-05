"use client"

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"

interface DoughnutChartProps {
  data: {
    labels: string[]
    data: number[]
  }
}

export function DoughnutChart({ data }: DoughnutChartProps) {
  const chartColors = ["#10b981", "#3b82f6", "#f97316"]

  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.data[index],
  }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
