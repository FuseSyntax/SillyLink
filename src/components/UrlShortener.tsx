"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ClipboardIcon, LinkIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function UrlShortener() {
  const { data: session } = useSession();
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setIsLoading(true);

    if (!longUrl) {
      setError("Please enter a URL");
      setIsLoading(false);
      return;
    }

    if (!isValidUrl(longUrl)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ longUrl, userId: session?.user?.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const { shortCode } = await response.json();
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://silly.link";
      setShortUrl(`${baseUrl}/${shortCode}`);
    } catch (err) {
      setError("Failed to shorten URL. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto p-4 pt-0">
      <div className="absolute inset-0 bg-gradient-to-r from-gradient-start to-gradient-end opacity-20 dark:opacity-10 blur-3xl animate-blob" />
      <div className="relative rounded-3xl p-8 shadow-2xl border border-primary">
        <div className="flex items-center gap-3 mb-8">
          <SparklesIcon className="h-8 w-8 text-neon-blue" aria-hidden="true" />
          <h2 className="text-4xl font-bold ">Shorten Magic</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-0 " />
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
                className="w-full p-5 rounded-xl bg-white/70  border-2 border-gray-700 focus:border-2 focus:ring-0 focus:ring-neon-blue/50 transition-all pr-14 text-lg"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "url-error" : undefined}
                disabled={isLoading}
              />
              <LinkIcon
                className="h-6 w-6 text-gray-400 absolute right-5 top-1/2 -translate-y-1/2 dark:text-gray-500"
                aria-hidden="true"
              />
            </div>
            {error && (
              <p id="url-error" className="text-red-500 text-sm mt-2">
                {error}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer p-5 rounded-xl font-bold text-lg border-2 border-black hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            aria-label="Create shortened URL"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-6 w-6 "
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <>
                <SparklesIcon className="h-6 w-6 " aria-hidden="true" />
                Create Magic Link
              </>
            )}
          </button>
        </form>
        {shortUrl && (
          <div className="mt-8 p-5 bg-white/50 backlashortenedUrlrop-blur-md rounded-xl border-2 border-gray-700 animate-fade-in">
            <div className="flex items-center justify-between gap-4">
              <span className="text-neon-blue flex items-center gap-3 text-lg">
                <LinkIcon className="h-6 w-6" aria-hidden="true" />
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono"
                  aria-label={`Shortened URL: ${shortUrl}`}
                >
                  {shortUrl}
                </a>
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(shortUrl)}
                className="p-3 cursor-pointer hover:outline-2 rounded-lg duration-200 transition-all"
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