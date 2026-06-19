"use client";

import Link from "next/link";
import { RefreshCw, ArrowLeft, Calendar, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to your error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center align-middle">

        <div className="absolute top-2 scale-75 left-0 flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              CampusHub
            </span>
          </div>
        </div>

        {/* Error Illustration */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-16 h-16 sm:w-20 sm:h-20 text-indigo-400" strokeWidth={1.5} />
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 animate-float">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-300 to-pink-300 rounded-full opacity-30 blur-lg" />
          </div>
          <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 animate-float-delayed">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-30 blur-lg" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 mb-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Something Went Wrong
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-lg mx-auto leading-relaxed">
            We hit a snag loading this page. Please refresh and try again —
            if the problem keeps happening, let us know.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-pink-600 transition-all shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh Page
          </button>

          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="absolute bottom-0 left-0 right-0 mt-16 py-2 lg:py-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Still stuck? Try one of these</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
              Home
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/applied" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
              My Events
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/profile" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
              Profile
            </Link>
            <span className="text-gray-300">•</span>
            <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-br from-indigo-200 to-pink-200 rounded-full opacity-20 blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full opacity-20 blur-3xl animate-blob animation-delay-4000" />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}