
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const user = session?.user;

  useEffect(() => {
    if (!isPending && !user) {
      router.replace(
        `/sign-in?callbackURL=${encodeURIComponent("/profile")}`
      );
    }
  }, [isPending, user, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
    }
  }, [user?.name]);

  const handleUpdateName = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("নাম লিখুন।");
      return;
    }

    if (trimmedName.length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে।");
      return;
    }

    if (trimmedName === user?.name) {
      toast.error("নামে কোনো পরিবর্তন করা হয়নি।");
      return;
    }

    setSaving(true);

    try {
      const result = await authClient.updateUser({
        name: trimmedName,
      });

      if (result?.error) {
        throw new Error(
          result.error.message || "নাম আপডেট করা যায়নি।"
        );
      }

      toast.success("আপনার নাম সফলভাবে আপডেট হয়েছে!");

      await authClient.getSession();
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error?.message || "নাম আপডেট করতে সমস্যা হয়েছে।"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result?.error) {
        throw new Error(
          result.error.message || "সাইন আউট করা যায়নি।"
        );
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে!");

      // Global Toaster থাকবে; navigation-এর আগে toast দেখানো হবে।
      window.setTimeout(() => {
        router.replace("/");
        router.refresh();
      }, 1200);
    } catch (error) {
      console.error("Sign out error:", error);

      toast.error(
        error?.message || "সাইন আউট করতে সমস্যা হয়েছে।"
      );

      setSigningOut(false);
    }
  };

  if (isPending || !user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f0f5f1] px-4">
        <div className="text-center">
          <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 border-[#078b43] border-t-transparent" />
          <p className="text-sm text-gray-600">
            প্রোফাইল লোড হচ্ছে...
          </p>
        </div>
      </main>
    );
  }

  const initial = (user.name || user.email || "U")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <main className="min-h-[calc(100vh-120px)] bg-[#f0f5f1] px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-950 sm:text-3xl">
            আমার প্রোফাইল
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন ও আপডেট করুন।
          </p>
        </div>

        <section className="mb-6 rounded-2xl border border-[#dce5dd] bg-[#fbfdfb] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#078b43] text-2xl font-bold text-white">
                {initial}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-gray-950">
                  {user.name || "নাম দেওয়া হয়নি"}
                </h2>
                <p className="break-all text-sm text-gray-600">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="shrink-0 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {signingOut ? "সাইন আউট হচ্ছে..." : "↪ সাইন আউট"}
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-[#dce5dd] bg-[#fbfdfb] p-5 sm:p-6">
          <h2 className="mb-5 text-xl font-bold text-gray-950">
            নাম হালনাগাদ করুন
          </h2>

          <form onSubmit={handleUpdateName}>
            <label
              htmlFor="profile-name"
              className="mb-2 block text-base font-medium text-gray-800"
            >
              নাম
            </label>

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম লিখুন"
              autoComplete="name"
              maxLength={100}
              required
              disabled={saving}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#078b43] focus:ring-2 focus:ring-[#078b43]/15 disabled:opacity-60"
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={saving || !name.trim()}
                className="rounded-lg bg-[#078b43] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#067638] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "আপডেট হচ্ছে..." : "নাম হালনাগাদ করুন"}
              </button>

              <Link
                href="/"
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                হোম পেজ
              </Link>
            </div>
          </form>
        </section>

        <p className="mt-5 text-center text-xs text-gray-500">
          আপনার অ্যাকাউন্টের তথ্য নিরাপদে সংরক্ষণ করুন।
        </p>
      </div>
    </main>
  );
}
