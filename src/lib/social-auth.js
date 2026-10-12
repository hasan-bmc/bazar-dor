"use client";

import { signIn } from "@/lib/auth-client";

export const handleGoogleSignIn = async (callbackURL = "/") => {
  return signIn.social({
    provider: "google",
    callbackURL,
  });
};

export const handleGitHubSignIn = async (callbackURL = "/") => {
  return signIn.social({
    provider: "github",
    callbackURL,
  });
};