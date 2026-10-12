"use client";

import { useState } from "react";
import { signUp, signIn } from "@/lib/auth-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function SignUp() {
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (data.password !== data.confirmPassword) {
            toast.error("পাসওয়ার্ড দুটি মিলছে না!");
            return;
        }

        if (String(data.name).trim().length < 3) {
            toast.error("নাম কমপক্ষে ৩ অক্ষরের হতে হবে।");
            return;
        }

        if (
            String(data.password).length < 8 ||
            !/[A-Z]/.test(String(data.password)) ||
            !/[0-9]/.test(String(data.password))
        ) {
            toast.error(
                "পাসওয়ার্ডে কমপক্ষে ৮ অক্ষর, ১টি বড় হাতের অক্ষর ও ১টি সংখ্যা দিন।"
            );
            return;
        }

        setLoading(true);

        try {
            const { error } = await signUp.email({
                name: String(data.name).trim(),
                email: String(data.email).trim(),
                password: String(data.password),
                callbackURL: "/",
            });

            if (error) {
                toast.error(
                    error.message || "অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।"
                );
                setLoading(false);
                return;
            }

            toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!", {
                autoClose: 2500,
            });

            // Toast দেখানোর পর Home Page-এ নিয়ে যাবে
            setTimeout(() => {
                window.location.replace("/");
            }, 2500);
        } catch (error) {
            console.error("Sign Up Error:", error);
            toast.error("সার্ভারে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।");
            setLoading(false);
        }
    };


    const handleSocialsignIn = async () => {
        const resData = await signIn.social({
            provider: "google",
            callbackURL: "/",
        })

        console.log("Social Sign In Result:", resData, error);

    }

    const handelgithubSignIn = async () => {
        const resData = await signIn.social({
            provider: "github",
            callbackURL: "/",
        })

        console.log("GitHub Sign In Result:", resData, error);
    }

    //   const handleSocialLogin = async (provider) => {
    //     try {
    //       const { error } = await signIn.social({
    //         provider,
    //         callbackURL: "/",
    //       });

    //       if (error) {
    //         toast.error(error.message || "সোশ্যাল লগইন করা যায়নি।");
    //       }
    //     } catch (error) {
    //       console.error("Social Login Error:", error);
    //       toast.error("সোশ্যাল লগইনে সমস্যা হয়েছে।");
    //     }
    //   };

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#f1f6f1] px-4 py-8">
            <ToastContainer
                position="top-right"
                autoClose={2500}
                theme="light"
                newestOnTop
                closeOnClick
                pauseOnHover
                style={{ zIndex: 999999 }}
            />

            <div className="w-full max-w-[346px]">
                <header className="text-center mb-5">
                    <h1 className="text-[25px] font-bold text-gray-950">
                        অ্যাকাউন্ট তৈরি করুন
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        বিনা খরচে সহজ অ্যাক্সেসের সব বিস্তারিত দয়া করে দেখুন।
                    </p>
                </header>

                <div className="rounded-2xl border border-[#dfe6df] bg-[#fbfcfb] p-5">
                    <form onSubmit={onSubmit} className="space-y-3.5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                নাম
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="যেমন: রহিম উদ্দিন"
                                autoComplete="name"
                                required
                                minLength={3}
                                disabled={loading}
                                className="w-full h-[35px] rounded-lg border border-gray-300 bg-transparent px-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 disabled:opacity-60"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
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
                                className="w-full h-[35px] rounded-lg border border-gray-300 bg-transparent px-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 disabled:opacity-60"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium mb-1"
                            >
                                পাসওয়ার্ড
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="কমপক্ষে ৮ অক্ষর"
                                autoComplete="new-password"
                                minLength={8}
                                required
                                disabled={loading}
                                className="w-full h-[35px] rounded-lg border border-gray-300 bg-transparent px-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 disabled:opacity-60"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium mb-1"
                            >
                                পাসওয়ার্ড নিশ্চিত করুন
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="আবার লিখুন"
                                autoComplete="new-password"
                                minLength={8}
                                required
                                disabled={loading}
                                className="w-full h-[35px] rounded-lg border border-gray-300 bg-transparent px-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 disabled:opacity-60"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-[35px] rounded-lg bg-green-700 hover:bg-green-800 text-white text-sm font-semibold shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-4">
                        <div className="h-px bg-gray-300 flex-1" />
                        <span className="text-xs text-gray-600">অথবা</span>
                        <div className="h-px bg-gray-300 flex-1" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Google Login */}
                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => handleSocialLogin("google")}
                            className="flex min-w-0 h-16 items-center justify-center gap-2 rounded-xl border border-gray-800 bg-transparent px-2 text-black transition-colors hover:bg-gray-100 disabled:opacity-60"
                        >
                            <svg
                                viewBox="0 0 48 48"
                                className="h-5 w-5 shrink-0"
                                aria-hidden="true"
                            >
                                <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15z" />
                                <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44z" />
                                <path fill="#FBBC05" d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8z" />
                                <path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8A19.4 19.4 0 0 0 24 4 20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12z" />
                            </svg>

                            <span className="text-center text-sm font-semibold leading-tight sm:text-base">
                                Google দিয়ে
                                <br />
                                চালিয়ে যান
                            </span>
                        </button>

                        {/* GitHub Login */}
                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => handelgithubSignIn()}
                            className="flex min-w-0 h-16 items-center justify-center gap-2 rounded-xl border border-gray-400 bg-[#e9ece9] px-2 text-black transition-colors hover:bg-gray-200 disabled:opacity-60"
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

                    <p className="text-center text-xs text-gray-600 mt-4">
                        অ্যাকাউন্ট আছে?{" "}
                        <a
                            href="/sign-in"
                            className="text-green-700 underline underline-offset-2 font-medium hover:text-green-900"
                        >
                            সাইন ইন করুন
                        </a>
                    </p>
                </div>

                <div className="text-center mt-5">
                    <Link
                        href="/"
                        className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-800"
                    >
                        ← হোম পেজে ফিরে যান
                    </Link>
                </div>
            </div>
        </main>
    );
}