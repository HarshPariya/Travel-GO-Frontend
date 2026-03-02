"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { tokenManager } from "../../../lib/auth";
import { getApiUrl } from "../../../lib/config";

export const dynamic = 'force-dynamic';

function AuthCallbackInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    const token = searchParams.get("token");
    console.log('callback params:', Object.fromEntries(searchParams.entries()));
    
    if (token) {
      // Store the token and redirect
      tokenManager.setToken(token);
      
      // Fetch user profile
      fetch(getApiUrl(`/auth/me`), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          tokenManager.setUser(data.user);
          setStatus("Success! Redirecting...");
          setTimeout(() => {
            router.push("/profile");
          }, 1500);
        } else {
          throw new Error("Failed to fetch user data");
        }
      })
      .catch(error => {
        console.error("Auth callback error:", error);
        setStatus("Authentication failed. Redirecting...");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      });
    } else {
      const entries = Object.fromEntries(searchParams.entries());
      console.warn('no token, params:', entries);
      setStatus("No token received. Redirecting...");
      // expose params for debugging (rendered below)
      setMessage(JSON.stringify(entries));
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Authentication
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {status}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Loading authentication...</div>
      </div>
    }>
      <AuthCallbackInner />
    </Suspense>
  );
}
