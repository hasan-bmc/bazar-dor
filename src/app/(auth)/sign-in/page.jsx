"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  handleGoogleSignIn,
  handleGitHubSignIn,
} from "@/lib/social-auth";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

function SignInForm() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const getCallbackURL = () => {
    const requestedURL = searchParams.get("callbackURL");

    if (
      requestedURL &&
      requestedURL.startsWith("/") &&
      !requestedURL.startsWith("//")
    ) {
      return requestedURL;
    }

    return "/";
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড লিখুন।");
      return;
    }

    setLoading(true);

    try {
      const callbackURL = getCallbackURL();

      const result = await signIn.email({
        email,
        password,
        callbackURL,
      });

      if (result?.error) {
        toast.error(
          result.error.message || "সাইন ইন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।"
        );
        setLoading(false);
        return;
      }

      toast.success("সাইন ইন সফল হয়েছে! স্বাগতম 🎉", {
        duration: 2500,
        position: "top-right",
      });

      window.setTimeout(() => {
        window.location.replace(callbackURL);
      }, 2200);
    } catch (error) {
      console.error("Sign-in request failed:", error);

      toast.error(
        error instanceof Error
          ? `সাইন ইন সমস্যা: ${error.message}`
          : "সার্ভারের সঙ্গে সংযোগ করা যায়নি।"
      );

      setLoading(false);
    }
  };

  const onGoogleClick = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await handleGoogleSignIn(getCallbackURL());
    } catch (error) {
      console.error("Google Sign In Error:", error);
      toast.error("Google দিয়ে সাইন ইন করতে সমস্যা হয়েছে।");
      setLoading(false);
    }
  };

  const onGitHubClick = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await handleGitHubSignIn(getCallbackURL());
    } catch (error) {
      console.error("GitHub Sign In Error:", error);
      toast.error("GitHub দিয়ে সাইন ইন করতে সমস্যা হয়েছে।");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f1f6f1] px-4 py-8">
      <header className="mb-5 text-center">
        <h1 className="text-[25px] font-bold text-gray-950">
          সাইন ইন
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          বিস্তারিত তথ্য দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </header>

      <section className="w-full max-w-[346px] rounded-2xl border border-[#dfe6df] bg-[#fbfcfb] p-5">
        <form onSubmit={onSubmit} className="space-y-3.5">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium"
            >
              ইমেইল
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              disabled={loading}
              className="h-[35px] w-full rounded-lg border border-gray-300 bg-[#e8f0fe] px-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium"
            >
              পাসওয়ার্ড
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              autoComplete="current-password"
              required
              disabled={loading}
              className="h-[35px] w-full rounded-lg border border-gray-300 bg-[#e8f0fe] px-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-[35px] w-full rounded-lg bg-green-700 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-xs text-gray-600">অথবা</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3">
          {/* Google */}
          <button
            type="button"
            disabled={loading}
            onClick={onGoogleClick}
            className="flex h-16 min-w-0 items-center justify-center gap-2 rounded-xl border border-gray-800 bg-transparent px-2 text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              viewBox="0 0 48 48"
              className="h-5 w-5 shrink-0"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15z"
              />
              <path
                fill="#34A853"
                d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44z"
              />
              <path
                fill="#FBBC05"
                d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8z"
              />
              <path
                fill="#EA4335"
                d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8A19.4 19.4 0 0 0 24 4 20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12z"
              />
            </svg>

            <span className="text-center text-sm font-semibold leading-tight sm:text-base">
              Google দিয়ে
              <br />
              চালিয়ে যান
            </span>
          </button>

          {/* GitHub */}
          <button
            type="button"
            disabled={loading}
            onClick={onGitHubClick}
            className="flex h-16 min-w-0 items-center justify-center gap-2 rounded-xl border border-gray-400 bg-[#e9ece9] px-2 text-black transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 shrink-0 fill-[#202923]"
              aria-hidden="true"
            >
              <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.68-3.75-1.32-3.75-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .7 2.05 3.1 3.1 1.55.1-.73.4-1.22.72-1.5-2.48-.28-5.1-1.24-5.1-5.52 0-1.22.44-2.22 1.16-3-.12-.29-.5-1.42.11-2.96 0 0 .95-.3 3.05 1.15a10.6 10.6 0 0 1 5.56 0c2.1-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.67.11 2.96.72.78 1.16 1.78 1.16 3 0 4.29-2.62 5.23-5.11 5.51.4.35.76 1.03.76 2.08V22c0 .29.2.63.77.53A11.1 11.1 0 0 0 12 .9z" />
            </svg>

            <span className="text-center text-sm font-semibold leading-tight sm:text-base">
              GitHub দিয়ে
              <br />
              চালিয়ে যান
            </span>
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-gray-600">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-green-700 underline underline-offset-2"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </section>

      <div className="mt-5 text-center">
        <Link
          href="/"
          className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-800"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f1f6f1]">
          <p className="text-sm text-gray-500">
            সাইন ইন পেজ লোড হচ্ছে...
          </p>
        </main>
      }
    >
      <SignInForm />
    </Suspense>
  );
}