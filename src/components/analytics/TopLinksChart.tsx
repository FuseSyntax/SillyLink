"use client";

import { SectionCard } from "./SectionCard";
import { LinkIcon } from "@heroicons/react/24/outline";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface LinkClickData {
  link: string;
  clicks: number;
}

interface TopLinksChartProps {
  linkClicks: LinkClickData[];
}

export const TopLinksChart: React.FC<TopLinksChartProps> = ({ linkClicks }) => (
  <SectionCard title="Top Links" icon={<LinkIcon />}>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={linkClicks}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4B8FFB" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#4B8FFB" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="link" tick={{ fill: "#6B7280" }} axisLine={{ stroke: "#6B7280" }} />
          <YAxis tick={{ fill: "#6B7280" }} axisLine={{ stroke: "#6B7280" }} />
          <Tooltip
            contentStyle={{
              background: "#1F2937",
              border: "2px solid #3B82F6",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="clicks" fill="url(#barGradient)" radius={[4, 4, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </SectionCard>
);
