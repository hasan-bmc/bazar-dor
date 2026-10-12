"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3500,
        style: {
          zIndex: 99999,
          fontFamily: "inherit",
        },
        success: {
          iconTheme: {
            primary: "#15803d",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}