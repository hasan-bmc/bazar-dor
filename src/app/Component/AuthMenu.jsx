"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AuthMenu() {
  const router = useRouter();
  const menuRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleSignOut() {
    if (loading) return;

    setLoading(true);

    try {
      const result = await authClient.signOut();

      if (result?.error) {
        console.error("Sign out failed:", result.error.message);
        return;
      }

      setOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (isPending) {
    return (
      <div
        className="h-10 w-24 animate-pulse rounded-xl bg-gray-100"
        aria-label="লোড হচ্ছে"
      />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/sign-in"
          className="rounded-xl px-3 py-2 text-sm font-semibold text-green-800 transition hover:bg-green-50 sm:px-4"
        >
          লগইন
        </Link>

        <Link
          href="/sign-up"
          className="rounded-xl bg-green-800 px-3 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-900 sm:px-4"
        >
          <span className="sm:hidden">নিবন্ধন</span>
          <span className="hidden sm:inline">
            অ্যাকাউন্ট তৈরি
          </span>
        </Link>
      </div>
    );
  }

  const displayName = user.name || user.email || "ব্যবহারকারী";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="ইউজার মেনু"
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1.5 pr-3 transition hover:border-green-300 hover:bg-green-50"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt=""
            className="h-9 w-9 rounded-lg object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-800 text-sm font-bold text-white">
            {initial}
          </span>
        )}

        <span className="hidden max-w-28 truncate text-sm font-semibold text-gray-800 sm:block">
          {displayName}
        </span>

        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`h-4 w-4 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            d="m5 7.5 5 5 5-5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-[60] mt-3 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-900/10"
        >
          <div className="border-b border-gray-100 bg-green-50/70 p-4">
            <p className="truncate text-sm font-bold text-gray-900">
              {user.name || "ব্যবহারকারী"}
            </p>

            <p className="mt-1 truncate text-xs text-gray-500">
              {user.email}
            </p>
          </div>

          <div className="p-2">
            <Link
              href="/"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-green-50 hover:text-green-800"
            >
              <span aria-hidden="true">🏠</span>
              হোম
            </Link>

            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-green-50 hover:text-green-800"
            >
              <span aria-hidden="true">👤</span>
              আমার প্রোফাইল
            </Link>

            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              disabled={loading}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span aria-hidden="true">↪️</span>
              {loading ? "লগআউট হচ্ছে..." : "লগআউট"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
