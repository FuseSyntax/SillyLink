"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ClipboardIcon, LinkIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { prisma } from "@/lib/prisma";

export default function UrlShortener() {
  const { data: session } = useSession();
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const generateShortCode = () => {
    return Math.random().toString(36).slice(2, 8);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShortUrl("");

    if (!longUrl) {
      setError("Please enter a URL");
      return;
    }

    try {
      const shortCode = generateShortCode();
      const newUrl = await prisma.shortenedUrl.create({
        data: {
          longUrl,
          shortCode,
          userId: session?.user?.id,
        },
      });
      setShortUrl(`silly.link/${newUrl.shortCode}`);
    } catch (err) {
      setError("Failed to shorten URL. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto p-4 pt-0">
      <div className="absolute inset-0 bg-gradient-to-r from-gradient-start to-gradient-end opacity-20 dark:opacity-10 blur-3xl animate-blob" />
      <div className="relative rounded-3xl p-8 shadow-2xl border border-black">
        <div className="flex items-center gap-3 mb-8">
          <SparklesIcon className="h-8 w-8 text-neon-blue" aria-hidden="true" />
          <h2 className="text-4xl font-bold">
            Shorten Magic
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute rounded-xl" />
            <div className="relative flex items-center">
              <label htmlFor="url-input" className="sr-only">
                Enter URL to shorten
              </label>
              <input
                id="url-input"
                type="url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="Enter URL to shorten..."
                className="w-full p-5 rounded-xl bg-white/70  border-2 focus:border-2 focus:ring-0 transition-all pr-14 text-lg"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "url-error" : undefined}
              />
              <LinkIcon className="h-6 w-6 text-gray-400 absolute right-5 top-1/2 -translate-y-1/2 dark:text-gray-500" aria-hidden="true" />
            </div>
            {error && (
              <p id="url-error" className="text-red-500 text-sm mt-2">
                {error}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full p-5 rounded-xl font-bold text-lg cursor-pointer border-2 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
            aria-label="Create shortened URL"
          >
            <SparklesIcon className="h-6 w-6" aria-hidden="true" />
            Create Magic Link
          </button>
        </form>
        {shortUrl && (
          <div className="mt-8 p-5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl border border-white/30 dark:border-gray-700 animate-fade-in">
            <div className="flex items-center justify-between gap-4">
              <span className="text-neon-blue flex items-center gap-3 text-lg">
                <LinkIcon className="h-6 w-6" aria-hidden="true" />
                <a
                  href={`https://${shortUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent font-mono"
                  aria-label={`Shortened URL: ${shortUrl}`}
                >
                  {shortUrl}
                </a>
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(`https://${shortUrl}`)}
                className="p-3 hover:bg-white/20 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                aria-label="Copy shortened URL to clipboard"
              >
                <ClipboardIcon className="h-6 w-6 text-neon-purple" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}