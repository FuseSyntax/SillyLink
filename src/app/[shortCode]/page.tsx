import { prisma } from "../../lib/prisma";
import { notFound, redirect } from "next/navigation";
import { trackClick } from "../../lib/clickTracker";
import { headers } from "next/headers";
import axios from "axios";

export const dynamic = "force-dynamic"; 

type Location = { city: string; coordinates: [number, number] };

const locationCache = new Map<string, Location>();

async function getLocation(ip: string): Promise<Location> {
  if (ip === "::1" || ip === "127.0.0.1") {
    return { city: "Unknown", coordinates: [0, 0] };
  }

  if (locationCache.has(ip)) {
    return locationCache.get(ip)!;
  }

  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    const { city, latitude, longitude, error, reason } = response.data as {
      city?: string;
      latitude?: number;
      longitude?: number;
      error?: boolean;
      reason?: string;
    };

    if (error || !city || latitude == null || longitude == null) {
      console.warn(`[getLocation] Invalid data for IP ${ip}:`, { error, reason, data: response.data });
      return { city: "Unknown", coordinates: [0, 0] };
    }

    const location: Location = {
      city,
      coordinates: [longitude, latitude],
    };
    locationCache.set(ip, location);
    return location;
  } catch (err) {
    console.error(`[getLocation] Error fetching location for IP ${ip}:`, err);
    return { city: "Unknown", coordinates: [0, 0] };
  }
}

export default async function RedirectPage({ params }: { params: { shortCode: string } }) {
  const { shortCode } = params;

  const url = await prisma.shortenedUrl.findUnique({
    where: { shortCode },
    select: { longUrl: true },
  });

  if (!url) return notFound();

  const headersList = headers();
  const allHeaders: Record<string, string> = {};
  for (const [key, value] of Array.from(headersList.entries())) {
    allHeaders[key] = value;
  }

  const referrer = headersList.get("referer") || "Direct";
  const referralKey = referrer.includes("twitter.com") || referrer.includes("x.com")
    ? "Social Media"
    : referrer.includes("mailto:") || referrer.includes("email")
    ? "Email"
    : referrer.includes("google.com")
    ? "Search"
    : "Direct";

  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "::1";

  const location = await getLocation(ip);
  await trackClick(shortCode, referralKey, location);

  redirect(url.longUrl);
}

export const revalidate = 3600;