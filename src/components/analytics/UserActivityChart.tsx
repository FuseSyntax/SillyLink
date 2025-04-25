"use client";

import { SectionCard } from "./SectionCard";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from "recharts";

interface ActivityData {
  date: string;
  visits: number;
}

interface UserActivityChartProps {
  activityData: ActivityData[];
}

export const UserActivityChart: React.FC<UserActivityChartProps> = ({ activityData }) => (
  <SectionCard title="User Activity" icon={<ChartBarIcon />}>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={activityData}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4B8FFB" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#4B8FFB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="date" tick={{ fill: "#6B7280" }} axisLine={{ stroke: "#6B7280" }} />
          <YAxis tick={{ fill: "#6B7280" }} axisLine={{ stroke: "#6B7280" }} />
          <Tooltip
            contentStyle={{
              background: "#1F2937",
              border: "2px solid #3B82F6",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="visits"
            stroke="#4B8FFB"
            strokeWidth={2}
            dot={{ fill: "#4B8FFB", strokeWidth: 2 }}
          />
          <Area type="monotone" dataKey="visits" fill="url(#lineGradient)" strokeWidth={0} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </SectionCard>
);
