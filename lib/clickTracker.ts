import { prisma } from "./prisma";

interface ClickData {
  shortCode: string;
  referralKey: string;
  location: { city: string; coordinates: [number, number] } | null;
}

const clickQueue: ClickData[] = [];

setInterval(async () => {
  if (clickQueue.length === 0) return;

  console.log("Processing click queue:", JSON.stringify(clickQueue, null, 2));

  const updates: {
    [shortCode: string]: {
      clicks: number;
      referrals: { [key: string]: number };
      locations: { [city: string]: { clicks: number; coordinates: [number, number] } };
    };
  } = {};
  for (const { shortCode, referralKey, location } of clickQueue) {
    if (!updates[shortCode]) {
      updates[shortCode] = { clicks: 0, referrals: {}, locations: {} };
    }
    updates[shortCode].clicks += 1;
    updates[shortCode].referrals[referralKey] = (updates[shortCode].referrals[referralKey] || 0) + 1;
    if (location && location.city !== "Unknown") {
      updates[shortCode].locations[location.city] = {
        clicks: (updates[shortCode].locations[location.city]?.clicks || 0) + 1,
        coordinates: location.coordinates,
      };
    }
  }

  clickQueue.length = 0;

  try {
    for (const [shortCode, { clicks, referrals, locations }] of Object.entries(updates)) {
      const url = await prisma.shortenedUrl.findUnique({
        where: { shortCode },
        select: { referrals: true },
      });
      if (url) {
        const currentReferrals = url.referrals ? { ...url.referrals } : {};
        for (const [key, count] of Object.entries(referrals)) {
          currentReferrals[key] = (currentReferrals[key] || 0) + count;
        }
        if (Object.keys(locations).length > 0) {
          currentReferrals.locations = currentReferrals.locations || {};
          for (const [city, { clicks, coordinates }] of Object.entries(locations)) {
            currentReferrals.locations[city] = { clicks, coordinates };
          }
        }
        const updatedUrl = await prisma.shortenedUrl.update({
          where: { shortCode },
          data: { clicks: { increment: clicks }, referrals: currentReferrals },
        });
        console.log(`Updated ${shortCode}: clicks +${clicks}, referrals:`, JSON.stringify(updatedUrl.referrals, null, 2));
      } else {
        console.warn(`ShortenedUrl not found for shortCode: ${shortCode}`);
      }
    }
  } catch (err) {
    console.error("Failed to process click queue:", err);
  }
}, 5000);

export function trackClick(shortCode: string, referralKey: string, location: ClickData["location"] = null) {
  console.log(`Queuing click for ${shortCode}: ${referralKey}, location:`, JSON.stringify(location, null, 2));
  clickQueue.push({ shortCode, referralKey, location });
}
