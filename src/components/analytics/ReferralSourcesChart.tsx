"use client";

import { SectionCard } from "./SectionCard";
import { UsersIcon } from "@heroicons/react/24/outline";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ReferralData {
  name: string;
  value: number;
}

interface ReferralSourcesChartProps {
  referrals: { [key: string]: number };
}

export const ReferralSourcesChart: React.FC<ReferralSourcesChartProps> = ({ referrals }) => {
  const data = Object.entries(referrals).map(([name, value]) => ({ name, value }));
  const COLORS = ["#4B8FFB", "#60A5FA", "#93C5FD", "#BFDBFE"];

  return (
    <SectionCard title="Referral Sources" icon={<UsersIcon />}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={60}
              paddingAngle={2}
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#1F2937",
                border: "2px solid #3B82F6",
                borderRadius: "8px",
              }}
            />
            <Legend layout="vertical" align="right" verticalAlign="middle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
};
