import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-yellow-400 mb-4">404</h1>
        <h2 className="text-2xl mb-6">页面遇到天劫，已飞升仙界</h2>
        <p className="text-gray-400 mb-8">
          看来你踏入了未知的修行之路，此地无缘得见
        </p>
        <div className="flex justify-center">
          <Link
            href="/game"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            返回修炼
          </Link>
        </div>
      </div>
    </div>
  );
}
