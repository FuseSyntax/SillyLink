import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { trackClick } from "@/lib/clickTracker";
import { headers } from "next/headers";
import axios from "axios";

const locationCache = new Map<string, { city: string; coordinates: [number, number] }>();

async function getLocation(ip: string) {
  if (ip === "::1" || ip === "127.0.0.1") {
    console.log(`[getLocation] Skipping location for reserved IP: ${ip}`);
    return { city: "Unknown", coordinates: [0, 0] };
  }

  if (locationCache.has(ip)) {
    console.log(`[getLocation] Cache hit for IP: ${ip}`, locationCache.get(ip));
    return locationCache.get(ip)!;
  }

  try {
    console.log(`[getLocation] Fetching location for IP: ${ip}`);
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    const { city, latitude, longitude, error, reason } = response.data;

    if (error || !city || !latitude || !longitude) {
      console.warn(`[getLocation] Invalid location data for IP ${ip}:`, { error, reason, data: response.data });
      return { city: "Unknown", coordinates: [0, 0] };
    }

    const location = { city, coordinates: [longitude, latitude] };
    locationCache.set(ip, location);
    console.log(`[getLocation] Cached location for IP ${ip}:`, location);
    return location;
  } catch (error) {
    console.error(`[getLocation] Failed to fetch location for IP ${ip}:`, error);
    return { city: "Unknown", coordinates: [0, 0] };
  }
}

export default async function RedirectPage({ params }: { params: { shortCode: string } }) {
  const { shortCode } = params;

  const url = await prisma.shortenedUrl.findUnique({
    where: { shortCode },
    select: { longUrl: true },
  });

  if (!url) {
    return notFound();
  }

  const headersList = headers();
  const referrer = (await headersList.get("referer")) || "Direct";
  const referralKey = referrer.includes("twitter.com") || referrer.includes("x.com")
    ? "Social Media"
    : referrer.includes("mailto:") || referrer.includes("email")
    ? "Email"
    : referrer.includes("google.com")
    ? "Search"
    : "Direct";

  const ip = (await headersList.get("x-forwarded-for"))?.split(",")[0] || "::1";
  console.log(`[RedirectPage] Processing click for shortCode: ${shortCode}, IP: ${ip}, Referrer: ${referrer}`);
  const location = await getLocation(ip);

  trackClick(shortCode, referralKey, location);

  redirect(url.longUrl);
}

export const revalidate = 3600;
