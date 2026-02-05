"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  CalendarCheck,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Moon,
  Star,
  User,
} from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Tên đăng nhập hoặc mật khẩu không đúng");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <motion.div
          className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Side - Marketing Content */}
        <motion.div
          className="hidden lg:block space-y-8"
          variants={itemVariants}
        >
          <div className="space-y-4">
            <motion.div
              className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 px-4 py-2 shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Star className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-gray-700">
                Lịch Việt Nam 2026
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl font-bold text-gray-900 dark:text-cyan-100 leading-tight"
              variants={itemVariants}
            >
              Quản lý lịch
              <br />
              <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                thông minh hơn
              </span>
            </motion.h1>

            <motion.p className="text-xl text-gray-600" variants={itemVariants}>
              Tra cứu lịch âm dương, ngày lễ tết Việt Nam với giao diện hiện đại
              và tính năng thông minh.
            </motion.p>
          </div>

          {/* Features */}
          <motion.div className="space-y-4" variants={containerVariants}>
            {[
              {
                icon: CalendarDays,
                title: "Lịch Âm Dương",
                description: "Chuyển đổi dễ dàng giữa lịch dương và âm lịch",
                color: "blue",
              },
              {
                icon: Moon,
                title: "Ngày Can Chi",
                description: "Xem can chi ngày, tháng, năm theo lịch Việt",
                color: "indigo",
              },
              {
                icon: CalendarCheck,
                title: "Ngày lễ Tết",
                description: "Tra cứu các ngày lễ tết truyền thống Việt Nam",
                color: "purple",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 p-4 shadow-sm"
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className={`rounded-lg bg-${feature.color}-100 p-2`}>
                  <feature.icon
                    className={`h-5 w-5 text-${feature.color}-600`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div className="w-full" variants={itemVariants}>
          <motion.div
            className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-gray-200 p-8 lg:p-10 shadow-2xl"
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          >
            {/* Logo */}
            <motion.div
              className="flex items-center justify-center mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring" as const,
                stiffness: 200,
                damping: 20,
              }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 blur-lg opacity-50"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="relative rounded-full bg-linear-to-r from-blue-600 to-indigo-600 p-4">
                  <CalendarDays className="h-8 w-8 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Header */}
            <motion.div className="text-center mb-8" variants={itemVariants}>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Chào mừng trở lại
              </h2>
              <p className="text-gray-600">Đăng nhập để tiếp tục sử dụng</p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Alert */}
              {error && (
                <motion.div
                  className="rounded-xl bg-red-50 border border-red-200 p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 500,
                    damping: 30,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-red-100 p-1">
                      <svg
                        className="h-4 w-4 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-red-900">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Username Input */}
              <motion.div className="space-y-2" variants={itemVariants}>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Tên đăng nhập
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <motion.input
                    id="username"
                    name="username"
                    type="text"
                    required
                    autoComplete="off"
                    data-form-type="other"
                    className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-12 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    placeholder="Nhập tên đăng nhập của bạn"
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div className="space-y-2" variants={itemVariants}>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Mật khẩu
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <motion.input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    data-form-type="other"
                    className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-12 pr-12 py-3.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    placeholder="Nhập mật khẩu của bạn"
                    whileFocus={{ scale: 1.01 }}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Remember & Forgot */}
              <motion.div
                className="flex items-center justify-between"
                variants={itemVariants}
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <span className="text-sm text-gray-600">
                    Ghi nhớ đăng nhập
                  </span>
                </label>
                <Link
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="relative w-full rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-4 text-white font-semibold shadow-lg shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden group"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
              >
                <span className="absolute inset-0 bg-linear-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Đang đăng nhập...</span>
                    </>
                  ) : (
                    <>
                      <span>Đăng nhập</span>
                      <motion.svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </motion.svg>
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Demo Info */}
            <motion.div
              className="mt-6 rounded-xl bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Lock className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 mb-2">
                    🔐 Thông tin đăng nhập demo
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-blue-700">
                        Username:
                      </span>
                      <code className="text-xs font-mono bg-blue-100 text-blue-900 px-2 py-1 rounded">
                        nhatnguyen
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-blue-700">
                        Password:
                      </span>
                      <code className="text-xs font-mono bg-blue-100 text-blue-900 px-2 py-1 rounded">
                        password123
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.p
              className="mt-6 text-center text-sm text-gray-600"
              variants={itemVariants}
            >
              Chưa có tài khoản?{" "}
              <Link
                href="#"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Đăng ký ngay
              </Link>
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
