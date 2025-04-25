"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { LinkIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { GithubIcon, GoogleIcon } from "../../components/Icons"; // You'll need to create these SVG components

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (provider: string) => {
    setLoading(true);
    await signIn(provider, { callbackUrl: "/analytics" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/20">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-primary">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary rounded-lg border-2 border-primary">
              <LinkIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-primary">
              SillyLink
              <span className="block text-lg font-normal text-gray-600">URL Management Platform</span>
            </h1>
          </div>

          <div className="space-y-6">
            <button
              onClick={() => handleSignIn("github")}
              disabled={loading}
              className="w-full cursor-pointer flex items-center justify-between p-4 bg-accent rounded-xl border-2 border-primary hover:shadow-lg transition-all disabled:opacity-50 group"
            >
              <div className="flex items-center gap-4">
                <GithubIcon className="h-8 w-8 text-primary" />
                <span className="text-xl font-semibold text-primary">
                  {loading ? "Connecting..." : "Continue with GitHub"}
                </span>
              </div>
              <ArrowRightIcon className="h-6 w-6 text-primary group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleSignIn("google")}
              disabled={loading}
              className="w-full cursor-pointer flex items-center justify-between p-4 bg-accent rounded-xl border-2 border-primary hover:shadow-lg transition-all disabled:opacity-50 group"
            >
              <div className="flex items-center gap-4">
                <GoogleIcon className="h-8 w-8 text-primary" />
                <span className="text-xl font-semibold text-primary">
                  {loading ? "Connecting..." : "Continue with Google"}
                </span>
              </div>
              <ArrowRightIcon className="h-6 w-6 text-primary group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-primary/20">
            <p className="text-center text-gray-600">
              By continuing, you agree to our<br />
              <a href="#" className="text-primary hover:underline">Terms of Service</a> and 
              <a href="#" className="text-primary hover:underline"> Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}