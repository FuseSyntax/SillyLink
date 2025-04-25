"use client";

import { SectionCard } from "./SectionCard";
import { LinkIcon } from "@heroicons/react/24/outline";

interface UrlData {
  id: string;
  shortCode: string;
  longUrl: string;
  clicks: number;
  createdAt: string;
}

interface UrlTableProps {
  shortenedUrls: UrlData[];
}

export const UrlTable: React.FC<UrlTableProps> = ({ shortenedUrls }) => (
  <SectionCard title="Your Shortened URLs" icon={<LinkIcon />}>
    {shortenedUrls.length === 0 ? (
      <p className="text-gray-500 text-center py-6">No URLs created yet</p>
    ) : (
      <div className="overflow-x-auto rounded-lg border-2 border-primary">
        <table className="w-full">
          <thead className="bg-primary/10">
            <tr>
              {["Short URL", "Original URL", "Clicks", "Created"].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-sm font-semibold text-primary border-b-2 border-primary"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/20">
            {shortenedUrls.map((url) => (
              <tr key={url.id} className="hover:bg-primary/5 transition-colors">
                <td className="px-4 py-3 text-primary font-mono truncate max-w-[160px]">
                  <a href={`/${url.shortCode}`} className="hover:underline hover:text-primary-dark">
                    /{url.shortCode}
                  </a>
                </td>
                <td className="px-4 py-3 text-gray-600 truncate max-w-[240px]">{url.longUrl}</td>
                <td className="px-4 py-3 text-primary font-semibold">{url.clicks}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(url.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </SectionCard>
);