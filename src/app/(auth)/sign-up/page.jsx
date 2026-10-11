"use client";

import { useState } from "react";
import { signUp, signIn } from "@/lib/auth-client";
import { FormEvent } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            const { data: resData, error } = await signUp.email({
                name: String(data.name).trim(),
                email: String(data.email).trim(),
                password: String(data.password),
                callbackUrl: "/",
            });

            console.log("Sign Up Response:", resData, error);

            if (error) {
                toast.error(
                    error.message || "অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।"
                );
                return;
            }

            toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");

        } catch (error) {
            console.error("Sign Up Error:", error);
            toast.error("সার্ভারে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।");
        } finally {
            setLoading(false);
        }
    };

    // const handleSocialLogin = async (
    //     provider: "google" | "github"
    // ) => {
    //     try {
    //         const { error } = await signIn.social({
    //             provider,
    //             callbackURL: "/",
    //         });

    //         if (error) {
    //             toast.error(
    //                 error.message || `${provider} দিয়ে লগইন করা যায়নি।`
    //             );
    //         }
    //     } catch (error) {
    //         console.error(`${provider} Login Error:`, error);
    //         toast.error("সোশ্যাল লগইনে সমস্যা হয়েছে।");
    //     }
    // };

    return (
        <main
            className="min-h-screen flex items-center justify-center
            bg-[#f1f6f1] px-4 py-8"
        >
            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="light"
                newestOnTop
                closeOnClick
                pauseOnHover
            />

            <div className="w-full max-w-[346px]">
                {/* Header */}
                <header className="text-center mb-5">
                    <h1 className="text-[25px] font-bold text-gray-950">
                        অ্যাকাউন্ট তৈরি করুন
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        বিনা খরচে সহজ অ্যাক্সেসের সব বিস্তারিত দয়া করে দেখুন।
                    </p>
                </header>

                {/* Signup Card */}
                <div
                    className="rounded-2xl border border-[#dfe6df]
                    bg-[#fbfcfb] p-5"
                >
                    <form onSubmit={onSubmit} className="space-y-3.5">
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium mb-1"
                            >
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
                                className="w-full h-[35px] rounded-lg
                                border border-gray-300 bg-transparent
                                px-3 text-sm outline-none
                                focus:border-green-600 focus:ring-1
                                focus:ring-green-600 disabled:opacity-60"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium mb-1"
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
                                className="w-full h-[35px] rounded-lg
                                border border-gray-300 bg-transparent
                                px-3 text-sm outline-none
                                focus:border-green-600 focus:ring-1
                                focus:ring-green-600 disabled:opacity-60"
                            />
                        </div>

                        {/* Password */}
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
                                className="w-full h-[35px] rounded-lg
                                border border-gray-300 bg-transparent
                                px-3 text-sm outline-none
                                focus:border-green-600 focus:ring-1
                                focus:ring-green-600 disabled:opacity-60"
                            />
                        </div>

                        {/* Confirm Password */}
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
                                className="w-full h-[35px] rounded-lg
                                border border-gray-300 bg-transparent
                                px-3 text-sm outline-none
                                focus:border-green-600 focus:ring-1
                                focus:ring-green-600 disabled:opacity-60"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-[35px] rounded-lg
                            bg-green-700 hover:bg-green-800
                            text-white text-sm font-semibold
                            shadow-sm transition-colors
                            disabled:cursor-not-allowed
                            disabled:opacity-60"
                        >
                            {loading
                                ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
                                : "অ্যাকাউন্ট তৈরি করুন"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-4">
                        <div className="h-px bg-gray-300 flex-1" />
                        <span className="text-xs text-gray-600">
                            অথবা
                        </span>
                        <div className="h-px bg-gray-300 flex-1" />
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin("google")}
                            className="h-[34px] rounded-lg border
                            border-gray-800 flex items-center
                            justify-center gap-2 text-xs
                            hover:bg-gray-100 transition-colors"
                        >
                            <svg
                                viewBox="0 0 48 48"
                                className="w-4 h-4"
                                aria-hidden="true"
                            >
                                <path
                                    fill="#EA4335"
                                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6
                                    l6.85-6.85C35.9 2.38 30.47 0
                                    24 0 14.62 0 6.51 5.38
                                    2.56 13.22l7.98 6.19C12.43
                                    13.72 17.74 9.5 24 9.5z"
                                    transform="translate(0 4)"
                                />
                                <path
                                    fill="#4285F4"
                                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94
                                    c-.58 2.96-2.26 5.48-4.75 7.18l7.73
                                    6C44.43 37.92 46.98 31.76 46.98 24.55z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M10.53 28.59A14.4 14.4 0 0 1
                                    9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9
                                    23.9 0 0 0 0 24c0 3.87.93 7.52 2.56
                                    10.78l7.97-6.19z"
                                    transform="translate(0 0)"
                                />
                                <path
                                    fill="#34A853"
                                    d="M24 48c6.48 0 11.93-2.13
                                    15.91-5.8l-7.73-6c-2.15 1.45-4.92
                                    2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98
                                    6.19C6.51 42.62 14.62 48 24 48z"
                                />
                            </svg>

                            <span>Google দিয়ে<br />চালিয়ে যান</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSocialLogin("github")}
                            className="h-[34px] rounded-lg border
                            border-gray-800 flex items-center
                            justify-center gap-2 text-xs
                            hover:bg-gray-100 transition-colors"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="w-4 h-4 fill-current"
                                aria-hidden="true"
                            >
                                <path d="M12 .9a11.1 11.1 0 0 0-3.51
                                21.63c.55.1.76-.24.76-.53v-2.08
                                c-3.1.68-3.75-1.32-3.75-1.32
                                -.5-1.29-1.24-1.63-1.24-1.63
                                -1.02-.7.08-.69.08-.69
                                1.13.08 1.73 1.16 1.73 1.16
                                1 .1.7 2.05 3.1 1.55
                                .1-.73.4-1.22.72-1.5
                                -2.48-.28-5.1-1.24-5.1-5.52
                                0-1.22.44-2.22 1.16-3
                                -.12-.29-.5-1.42.11-2.96
                                0 0 .95-.3 3.05 1.15
                                a10.6 10.6 0 0 1 5.56 0
                                c2.1-1.45 3.05-1.15 3.05-1.15
                                .61 1.54.23 2.67.11 2.96
                                .72.78 1.16 1.78 1.16 3
                                0 4.29-2.62 5.23-5.11 5.51
                                .4.35.76 1.03.76 2.08V22
                                c0 .29.2.63.77.53A11.1 11.1
                                0 0 0 12 .9z" />
                            </svg>

                            <span>GitHub দিয়ে<br />চালিয়ে যান</span>
                        </button>
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-xs text-gray-600 mt-4">
                        অ্যাকাউন্ট আছে?{" "}
                        <a
                            href="/sign-in"
                            className="text-green-700 underline
                            underline-offset-2 font-medium
                            hover:text-green-900"
                        >
                            সাইন ইন করুন
                        </a>
                    </p>
                </div>

                {/* Back Link */}
                <div className="text-center mt-5">
                    <a
                        href="/"
                        className="text-sm text-gray-500
                        underline underline-offset-2
                        hover:text-gray-800"
                    >
                        ← হোম পেজে ফিরে যান
                    </a>
                </div>
            </div>
        </main>
    );
}
