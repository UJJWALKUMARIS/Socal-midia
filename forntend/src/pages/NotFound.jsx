import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-gray-200 px-4 text-center">
      
      <h1 className="text-[120px] font-extrabold text-sky-400 leading-none">
        404
      </h1>

      <h2 className="text-3xl font-semibold mt-2">
        Page Not Found
      </h2>

      <p className="text-gray-400 max-w-md mt-4">
        This page doesn’t exist right now.  
        It may be added in a future update — please wait for it 🚀
      </p>

      <div className="flex gap-4 mt-8">
        <Link
          to="/"
          className="px-6 py-3 rounded-lg bg-sky-500 text-slate-900 font-semibold hover:bg-sky-400 transition"
        >
          Go Home
        </Link>

        <button
          disabled
          className="px-6 py-3 rounded-lg border border-gray-600 text-gray-400 cursor-not-allowed"
        >
          Coming Soon
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-10">
        © {new Date().getFullYear()} • Feature under development
      </p>
    </div>
  );
}

export default NotFound;