
import { prisma } from "./prisma";

interface LocationReferral {
  [city: string]: { clicks: number; coordinates: [number, number] };
}

interface Referrals {
  [key: string]: number | LocationReferral;
  locations: LocationReferral;
}

interface ClickData {
  shortCode: string;
  referralKey: string;
  location: { city: string; coordinates: [number, number] } | null;
}

const clickQueue: ClickData[] = [];

setInterval(async () => {
  if (clickQueue.length === 0) return;

  console.log("Processing click queue:", JSON.stringify(clickQueue, null, 2));

  const updates: Record<string, { clicks: number; referrals: Referrals }> = {};

  for (const { shortCode, referralKey, location } of clickQueue) {
    if (!updates[shortCode]) {
      updates[shortCode] = { clicks: 0, referrals: { locations: {} } };
    }

    updates[shortCode].clicks += 1;
    updates[shortCode].referrals[referralKey] =
      (typeof updates[shortCode].referrals[referralKey] === "number"
        ? updates[shortCode].referrals[referralKey]
        : 0) + 1;

    if (location && location.city !== "Unknown") {
      const locs = updates[shortCode].referrals.locations;
      locs[location.city] = {
        clicks: (locs[location.city]?.clicks || 0) + 1,
        coordinates: location.coordinates,
      };
    }
  }

  clickQueue.length = 0;

  try {
    for (const [shortCode, { clicks, referrals }] of Object.entries(updates)) {
      const result = await prisma.shortenedUrl.findUnique({
        where: { shortCode },
        select: { referrals: true },
      });

      if (!result) {
        console.warn(`ShortenedUrl not found for shortCode: ${shortCode}`);
        continue;
      }

      const existing = (result.referrals as Referrals) ?? { locations: {} };
      const currentReferrals: Referrals = { ...existing };

      for (const [key, count] of Object.entries(referrals)) {
        if (key !== "locations") {
          currentReferrals[key] =
            ((currentReferrals[key] as number) || 0) + (count as number);
        }
      }

      if (referrals.locations && Object.keys(referrals.locations).length > 0) {
        currentReferrals.locations = currentReferrals.locations || {};
        for (const [city, { clicks: cityClicks, coordinates }] of Object.entries(
          referrals.locations
        )) {
          const prev = currentReferrals.locations[city] || { clicks: 0, coordinates };
          currentReferrals.locations[city] = {
            clicks: prev.clicks + cityClicks,
            coordinates,
          };
        }
      }

      const updatedUrl = await prisma.shortenedUrl.update({
        where: { shortCode },
        data: { clicks: { increment: clicks }, referrals: currentReferrals },
      });

      console.log(
        `Updated ${shortCode}: clicks +${clicks}, referrals:`,
        JSON.stringify(updatedUrl.referrals, null, 2)
      );
    }
  } catch (err) {
    console.error("Failed to process click queue:", err);
  }
}, 5000);

export function trackClick(
  shortCode: string,
  referralKey: string,
  location: ClickData["location"] = null
) {
  console.log(
    `Queuing click for ${shortCode}: ${referralKey}, location:`,
    JSON.stringify(location, null, 2)
  );
  clickQueue.push({ shortCode, referralKey, location });
}
