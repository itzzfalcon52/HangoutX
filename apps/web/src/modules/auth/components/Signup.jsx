"use client";

import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Signup = () => {
  const { handleSignUp, isSignedIn } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  // Handle form submission
  const onSubmit = (data) => {
    handleSignUp.mutate(data, {
      onSuccess: () => {
        console.log("Signup successful!");
        router.push("/login");
      },
      onError: (error) => {
        console.error("Signup failed:", error);
      },
    });
  };

  // If user is already signed in, show a message
  if (isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0f14]">
        <div className="bg-[#151a21] border border-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <div className="mb-6">
            <svg
              className="w-20 h-20 text-cyan-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="text-3xl font-bold text-white mb-2">
              You're Already <span className="text-cyan-400">Logged In</span>
            </h1>
            <p className="text-gray-400">
              You already have an active session. Would you like to go to your profile or explore spaces?
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/profile"
              className="block w-full px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
            >
              Go to Profile
            </Link>
            <Link
              href="/spaces"
              className="block w-full px-4 py-3 bg-transparent border-2 border-cyan-500 hover:bg-cyan-500/10 text-cyan-400 font-medium rounded-lg transition-all duration-300"
            >
              Explore Spaces
            </Link>
            <Link
              href="/"
              className="block w-full px-4 py-3 text-gray-400 hover:text-white transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Normal signup form
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0f14] py-12 px-4">
      <div className="bg-[#151a21] border border-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-full mb-4">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-2 text-white ">
            Join the <span className="text-cyan-400">Metaverse</span>
          </h1>
          <p className="text-gray-400">Create your account and start exploring virtual worlds</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                {...register("username", {
                  required: "Username is required",
                  minLength: { value: 3, message: "Username must be at least 3 characters" },
                })}
                className={`block w-full px-4 py-3 bg-[#0b0f14] text-gray-200 border ${
                  errors.username ? "border-red-500" : "border-gray-800"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                placeholder="Choose a unique username"
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.username.message}
                </p>
              )}
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                className={`block w-full px-4 py-3 bg-[#0b0f14] text-gray-200 border ${
                  errors.password ? "border-red-500" : "border-gray-800"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                placeholder="Create a strong password"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
                className={`block w-full px-4 py-3 bg-[#0b0f14] text-gray-200 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-800"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full px-4 py-3 text-white font-semibold rounded-lg transition-all duration-300 ${
              handleSignUp.isPending
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-600 shadow-lg hover:shadow-cyan-500/50"
            }`}
            disabled={handleSignUp.isPending}
          >
            {handleSignUp.isPending ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating your account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#151a21] text-gray-400">Already have an account?</span>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-block w-full px-4 py-3 bg-transparent border-2 border-cyan-500 hover:bg-cyan-500/10 text-cyan-400 font-medium rounded-lg transition-all duration-300"
          >
            Login Instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;