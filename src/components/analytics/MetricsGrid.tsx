"use client";

import { MetricCard } from "./MetricCard";
import { UsersIcon, GlobeAltIcon, ChartBarIcon } from "@heroicons/react/24/outline";

interface MetricsGridProps {
  totalUrls: number;
  totalClicks: number;
  averageClicks: number;
  urlTrend: { trend: "up" | "down"; trendValue: string };
  clickTrend: { trend: "up" | "down"; trendValue: string };
  avgClickTrend: { trend: "up" | "down"; trendValue: string };
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  totalUrls,
  totalClicks,
  averageClicks,
  urlTrend,
  clickTrend,
  avgClickTrend,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <MetricCard
      icon={<UsersIcon />}
      title="Total URLs"
      value={totalUrls}
      trend={urlTrend.trend}
      trendValue={urlTrend.trendValue}
    />
    <MetricCard
      icon={<GlobeAltIcon />}
      title="Total Clicks"
      value={totalClicks}
      trend={clickTrend.trend}
      trendValue={clickTrend.trendValue}
    />
    <MetricCard
      icon={<ChartBarIcon />}
      title="Avg. Clicks"
      value={averageClicks}
      trend={avgClickTrend.trend}
      trendValue={avgClickTrend.trendValue}
    />
  </div>
);