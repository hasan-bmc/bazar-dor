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

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => handleSocialsignIn()}
                            className="h-[34px] rounded-lg border border-gray-800 flex items-center justify-center gap-2 text-xs hover:bg-gray-100 transition-colors"
                        >
                            Google দিয়ে
                            <br />
                            চালিয়ে যান
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSocialLogin("github")}
                            className="h-[34px] rounded-lg border border-gray-800 flex items-center justify-center gap-2 text-xs hover:bg-gray-100 transition-colors"
                        >
                            GitHub দিয়ে
                            <br />
                            চালিয়ে যান
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