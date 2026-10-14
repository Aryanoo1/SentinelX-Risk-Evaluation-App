"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-surface border-b border-gray-700">
      <Link href="/" className="text-2xl font-bold text-primary hover:opacity-90 transition">
        Sentinel<span className="text-white">X</span>
      </Link>
      <nav className="flex space-x-4">
        <Link
          href="/compliance"
          className={`px-3 py-1 rounded ${pathname.startsWith("/compliance") ? "bg-primary text-white" : "text-text hover:bg-surface"}`}
        >
          Compliance Portal
        </Link>
        <Link
          href="/consumer"
          className={`px-3 py-1 rounded ${pathname.startsWith("/consumer") ? "bg-primary text-white" : "text-text hover:bg-surface"}`}
        >
          Consumer App
        </Link>
      </nav>
      <button
        onClick={() => setDark(!dark)}
        className="p-2 rounded hover:bg-surface"
        aria-label="Toggle dark mode"
      >
        {dark ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-primary" />}
      </button>
    </header>
  );
}
