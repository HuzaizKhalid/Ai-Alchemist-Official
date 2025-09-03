import React from "react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-slate-900">
      <h1 className="text-3xl font-semibold text-white/80 tracking-wide">
        Coming <span className="text-blue-400">Soon</span>
      </h1>

      <Link
        href="/"
        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default Page;
