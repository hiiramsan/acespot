"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Countdown timer for resend button
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleResendEmail = async () => {
    if (!email) {
      setResendError("Email address is missing. Please sign up again.");
      return;
    }

    setResendLoading(true);
    setResendError(null);
    
    try {
      // TODO: Connect to your actual resend email API
      // For now, simulating the API call
      console.log("Resending verification email to:", email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResendSuccess(true);
      setTimeLeft(30); // 30 second cooldown
      setTimeout(() => setResendSuccess(false), 4000);
    } catch (error) {
      setResendError("An error occurred. Please try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-dvh w-full bg-[#030303] flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="#BEF264"
            className="hover:opacity-80 transition-opacity"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M16 12h7v1h-7zM2 13h7v-1H2zm10 10h1v-7h-1zm0-14h1V2h-1zm-2 1h5v5h-5zm1 4h3v-3h-3z"></path>
              <path fill="none" d="M0 0h24v24H0z"></path>
            </g>
          </svg>
          <span className="text-xl font-nav tracking-normal text-white">
            ACE<span className="font-medium font-inter">SPOT</span>
          </span>
        </Link>

        {/* Email Icon Animation */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 bg-gradient-to-br from-lime-300/20 to-transparent rounded-2xl blur-xl animate-pulse"></div>
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-lime-300/10 to-transparent border border-lime-300/30 rounded-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#BEF264"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce"
            >
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-nav font-light tracking-normal text-white">
            Check your email
          </h1>
          <div className="space-y-1">
            <p className="text-gray-300 font-nav text-sm leading-relaxed">
              We've sent a confirmation link to:
            </p>
            <p className="text-lime-300 font-nav text-sm font-medium break-all">
              {email ? email : "your email address"}
            </p>
          </div>
          <p className="text-gray-400 font-nav text-xs leading-relaxed">
            Click the link to verify your email and start booking your favorite courts.
          </p>
        </div>

        {/* Error Message */}
        {resendError && (
          <div className="w-full bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm font-nav flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <p className="font-medium mb-1">Failed to resend</p>
              <p className="text-xs">{resendError}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {resendSuccess && (
          <div className="w-full bg-lime-300/10 border border-lime-300/30 rounded-lg p-4 text-lime-300 text-sm font-nav flex items-start gap-3 animate-in">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <p>Verification email sent! Check your inbox.</p>
          </div>
        )}

        {/* Resend Button */}
        <button
          onClick={handleResendEmail}
          disabled={resendLoading || timeLeft > 0}
          className="w-full h-10 bg-lime-300/90 hover:bg-lime-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-nav font-medium text-sm rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          {resendSuccess ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Email sent!
            </span>
          ) : resendLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 4.5a10 10 0 0 1-18.8 4.2"></path>
              </svg>
              Sending...
            </span>
          ) : timeLeft > 0 ? (
            <span>Resend in {timeLeft}s</span>
          ) : (
            "Didn't receive it? Resend"
          )}
        </button>

        {/* Spam Reminder */}
        <p className="text-xs text-gray-400 text-center font-nav leading-relaxed">
          💡 <span className="font-medium">Tip:</span> Check your spam or promotions folder if you don't see the email in a few minutes.
        </p>

        {/* Back to Login */}
        <div className="text-center">
          <p className="text-sm text-gray-400 font-nav">
            Wrong email?{" "}
            <Link
              href="/auth"
              className="text-lime-300 hover:text-lime-200 transition-colors font-medium"
            >
              Sign up again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}