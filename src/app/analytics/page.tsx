"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LinkIcon } from "@heroicons/react/24/outline";
import { MetricsGrid } from "../../components/analytics/MetricsGrid";
import { UserActivityChart } from "../../components/analytics/UserActivityChart";
import { UserLocationsMap } from "../../components/analytics/UserLocationsMap";
import { TopLinksChart } from "../../components/analytics/TopLinksChart";
import { ReferralSourcesChart } from "../../components/analytics/ReferralSourcesChart";
import { UrlTable } from "../../components/analytics/UrlTable";

interface MetricData {
  totalUrls: number;
  totalClicks: number;
  averageClicks: number;
}

interface UrlData {
  id: string;
  shortCode: string;
  longUrl: string;
  clicks: number;
  createdAt: string;
  referrals?: { [key: string]: number | { clicks: number; coordinates: [number, number] } };
}

interface Trend {
  trend: "up" | "down";
  trendValue: string;
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const [shortenedUrls, setShortenedUrls] = useState<UrlData[]>([]);
  const [prevMetrics, setPrevMetrics] = useState<MetricData | null>(null);
  const [error, setError] = useState("");

  const fetchUrls = async () => {
    try {
      const currentUrl = session?.user?.id
        ? `/api/analytics?userId=${session.user.id}`
        : "/api/analytics";
      const currentResponse = await fetch(currentUrl);
      if (!currentResponse.ok) throw new Error("Failed to fetch current analytics");
      const urls = await currentResponse.json();
      setShortenedUrls(urls);
      console.log("[AnalyticsPage] Current URLs:", urls);

      const prevUrl = session?.user?.id
        ? `/api/analytics?userId=${session.user.id}&period=previous`
        : "/api/analytics?period=previous";
      const prevResponse = await fetch(prevUrl);
      if (prevResponse.ok) {
        const prevUrls = await prevResponse.json();
        console.log("[AnalyticsPage] Previous URLs:", prevUrls);
        const prevTotalUrls = prevUrls.length;
        const prevTotalClicks = prevUrls.reduce((sum: number, url: UrlData) => sum + url.clicks, 0);
        const prevAverageClicks = prevTotalUrls ? Math.round(prevTotalClicks / prevTotalUrls) : 0;
        setPrevMetrics({ totalUrls: prevTotalUrls, totalClicks: prevTotalClicks, averageClicks: prevAverageClicks });
      } else {
        console.warn("[AnalyticsPage] No previous data available:", prevResponse.status);
        setPrevMetrics({ totalUrls: 0, totalClicks: 0, averageClicks: 0 });
      }
    } catch (err) {
      setError("Failed to load analytics. Please try again.");
      console.error("[AnalyticsPage] Analytics fetch error:", err);
    }
  };

  useEffect(() => {
    fetchUrls();
    const interval = setInterval(fetchUrls, 30000);
    return () => clearInterval(interval);
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-primary text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link href="/login">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer p-4 bg-white/50 rounded-xl border-2 border-primary text-primary hover:shadow-lg transition-all"
          >
            Please sign in to view analytics
          </motion.div>
        </Link>
      </div>
    );
  }

  const totalUrls = shortenedUrls.length;
  const totalClicks = shortenedUrls.reduce((sum, url) => sum + url.clicks, 0);
  const averageClicks = totalUrls ? Math.round(totalClicks / totalUrls) : 0;

  const calculateTrend = (current: number, previous: number): { trend: "up" | "down"; trendValue: string } => {
    if (isNaN(previous)) return { trend: "up", trendValue: "N/A" };
    if (previous === 0 && current === 0) return { trend: "up", trendValue: "0%" };
    if (previous === 0) return { trend: "up", trendValue: "New" };
    const percentage = ((current - previous) / previous * 100).toFixed(1);
    return {
      trend: current >= previous ? "up" : "down",
      trendValue: `${Math.abs(parseFloat(percentage))}%`,
    } as { trend: "up" | "down"; trendValue: string };
  };

  const urlTrend: Trend = prevMetrics
    ? calculateTrend(totalUrls, prevMetrics.totalUrls)
    : { trend: "up", trendValue: "N/A" };
  const clickTrend: Trend = prevMetrics
    ? calculateTrend(totalClicks, prevMetrics.totalClicks)
    : { trend: "up", trendValue: "N/A" };
  const avgClickTrend: Trend = prevMetrics
    ? calculateTrend(averageClicks, prevMetrics.averageClicks)
    : { trend: "up", trendValue: "N/A" };

  const activityData = shortenedUrls.map((url) => ({
    date: new Date(url.createdAt).toLocaleDateString(),
    visits: url.clicks,
  }));

  const linkClicks = shortenedUrls.map((url) => ({
    link: url.shortCode,
    clicks: url.clicks,
  }));

  const referrals = shortenedUrls.reduce((acc, url) => {
    if (url.referrals) {
      Object.entries(url.referrals).forEach(([source, count]) => {
        if (source !== "locations") {
          acc[source] = (acc[source] || 0) + (count as number);
        }
      });
    }
    return acc;
  }, {} as { [key: string]: number });

  const userLocations = shortenedUrls.reduce((acc, url, urlIndex) => {
    if (url.referrals?.locations) {
      Object.entries(url.referrals.locations).forEach(([city, { clicks, coordinates }]) => {
        const existing = acc.find((loc) => loc.name === city && loc.urlId === url.id);
        if (existing) {
          existing.clicks += clicks;
        } else {
          acc.push({ name: city, coordinates: coordinates as [number, number], clicks, urlId: url.id });
        }
      });
    } else {
      const mockCities = ["New York", "Paris", "Tokyo", "Sydney"];
      const mockCoords: [number, number][] = [
        [-74.006, 40.7128],
        [2.3522, 48.8566],
        [139.6917, 35.6895],
        [151.2093, -33.8688],
      ];
      acc.push({
        name: mockCities[urlIndex % 4],
        coordinates: mockCoords[urlIndex % 4],
        clicks: url.clicks || 0,
        urlId: url.id,
      });
    }
    return acc;
  }, [] as { name: string; coordinates: [number, number]; clicks: number; urlId: string }[]);

  console.log("[AnalyticsPage] userLocations:", JSON.stringify(userLocations, null, 2));

  const hasRealLocations = userLocations.some((loc) => !["New York", "Paris", "Tokyo", "Sydney"].includes(loc.name));

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-8">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 blur-3xl animate-blob" />
      <div className="relative rounded-2xl p-8 shadow-2xl border-2 border-primary backdrop-blur-sm">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold text-primary mb-8 flex items-center gap-3"
        >
          <LinkIcon className="h-8 w-8 text-primary" />
          Analytics Dashboard for {session.user?.name}
        </motion.h1>

        {error && (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="mb-8 p-4 bg-red-100/50 border-2 border-red-400 rounded-xl text-red-600"
          >
            <p className="text-center">{error}</p>
            {!hasRealLocations && (
              <p className="text-center text-sm mt-2">
                Location data unavailable. Try clicking URLs in production or from non-local devices.
              </p>
            )}
            <button
              onClick={fetchUrls}
              className="mt-2 mx-auto block px-4 py-2 bg-primary text-white rounded-lg"
            >
              Retry
            </button>
          </motion.div>
        )}

        <MetricsGrid
          totalUrls={totalUrls}
          totalClicks={totalClicks}
          averageClicks={averageClicks}
          urlTrend={urlTrend}
          clickTrend={clickTrend}
          avgClickTrend={avgClickTrend}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <UserActivityChart activityData={activityData} />
          <UserLocationsMap userLocations={userLocations} />
          <TopLinksChart linkClicks={linkClicks} />
          <ReferralSourcesChart referrals={referrals} />
        </div>

        <UrlTable shortenedUrls={shortenedUrls} />
      </div>
    </div>
  );
}
