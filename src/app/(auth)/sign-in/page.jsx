"use client";

import { useState  } from "react";
import { signIn } from "@/lib/auth-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        const form = e.currentTarget;
        const formData = new FormData(form);

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
            const result = await signIn.email({
                email,
                password,
                callbackURL: "/",
            });

            console.log("Better Auth sign-in result:", result);

            if (result.error) {
                toast.error(
                    result.error.message ||
                    "সাইন ইন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।"
                );
                return;
            }

            if (!result.data) {
                toast.error("সার্ভার থেকে সঠিক response পাওয়া যায়নি।");
                return;
            }

            toast.success("সাইন ইন সফল হয়েছে!");

            // Navigate only after successful authentication.
            window.location.replace("/");

        } catch (error) {
            console.error("Sign-in request failed:", error);

            toast.error(
                error instanceof Error
                    ? `সাইন ইন সমস্যা: ${error.message}`
                    : "সার্ভারের সঙ্গে সংযোগ করা যায়নি।"
            );
        } finally {
            setLoading(false);
        }
    };

    // const handleSocialLogin = async (
    //     provider: "google" | "github"
    // ) => {
    //     try {
    //         const result = await signIn.social({
    //             provider,
    //             callbackURL: "/",
    //         });

    //         if (result.error) {
    //             toast.error(
    //                 result.error.message || "সোশ্যাল লগইন ব্যর্থ হয়েছে।"
    //             );
    //         }
    //     } catch (error) {
    //         console.error("Social sign-in error:", error);
    //         toast.error("সোশ্যাল লগইনে সমস্যা হয়েছে।");
    //     }
    // };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-[#f1f6f1] px-4 py-8">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="light"
                newestOnTop
                closeOnClick
                pauseOnHover
            />

            <header className="text-center mb-5">
                <h1 className="text-[25px] font-bold text-gray-950">
                    সাইন ইন
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    বিস্তারিত তথ্য দেখতে অ্যাকাউন্টে ঢুকুন।
                </p>
            </header>

            <section className="w-full max-w-[346px] rounded-2xl border border-[#dfe6df] bg-[#fbfcfb] p-5">
                <form onSubmit={onSubmit} className="space-y-3.5">
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
                            className="w-full h-[35px] rounded-lg border border-gray-300 bg-[#e8f0fe] px-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 disabled:opacity-60"
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
                            placeholder="আপনার পাসওয়ার্ড লিখুন"
                            autoComplete="current-password"
                            required
                            disabled={loading}
                            className="w-full h-[35px] rounded-lg border border-gray-300 bg-[#e8f0fe] px-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 disabled:opacity-60"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-[35px] rounded-lg bg-green-700 hover:bg-green-800 text-white text-sm font-semibold shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
                    </button>
                </form>

                <div className="flex items-center gap-3 my-4">
                    <div className="h-px flex-1 bg-gray-300" />
                    <span className="text-xs text-gray-600">অথবা</span>
                    <div className="h-px flex-1 bg-gray-300" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => handleSocialLogin("google")}
                        className="h-[34px] rounded-lg border border-gray-800 flex items-center justify-center gap-2 text-xs hover:bg-gray-100"
                    >
                        <span className="font-bold text-base text-blue-600">
                            G
                        </span>
                        <span className="leading-3 text-center">
                            Google দিয়ে<br />চালিয়ে যান
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSocialLogin("github")}
                        className="h-[34px] rounded-lg border border-gray-800 flex items-center justify-center gap-2 text-xs hover:bg-gray-100"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="w-4 h-4 fill-current"
                            aria-hidden="true"
                        >
                            <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.68-3.75-1.32-3.75-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .1.7 2.05 3.1 1.55.1-.73.4-1.22.72-1.5-2.48-.28-5.1-1.24-5.1-5.52 0-1.22.44-2.22 1.16-3-.12-.29-.5-1.42.11-2.96 0 0 .95-.3 3.05 1.15a10.6 10.6 0 0 1 5.56 0c2.1-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.67.11 2.96.72.78 1.16 1.78 1.16 3 0 4.29-2.62 5.23-5.11 5.51.4.35.76 1.03.76 2.08V22c0 .29.2.63.77.53A11.1 11.1 0 0 0 12 .9z" />
                        </svg>

                        <span className="leading-3 text-center">
                            GitHub দিয়ে<br />চালিয়ে যান
                        </span>
                    </button>
                </div>

                <p className="text-center text-xs text-gray-600 mt-4">
                    অ্যাকাউন্ট নেই?{" "}
                    <a
                        href="/sign-up"
                        className="text-green-700 underline underline-offset-2 font-medium"
                    >
                        সাইন আপ করুন
                    </a>
                </p>
            </section>

            <div className="text-center mt-5">
                <a
                    href="/"
                    className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-800"
                >
                    ← হোম পেজে ফিরে যান
                </a>
            </div>
        </main>
    );
}
