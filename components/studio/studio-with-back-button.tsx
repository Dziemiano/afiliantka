"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../sanity.config";
import Link from "next/link";

export function StudioWithBackButton() {
  return (
    <div className="relative">
      {/* Back to Admin Button */}
      <div className="fixed top-100 left-4 z-50">
        <Link
          href="/admin"
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Admin
        </Link>
      </div>

      {/* Studio Component */}
      <NextStudio config={config} />
    </div>
  );
}
