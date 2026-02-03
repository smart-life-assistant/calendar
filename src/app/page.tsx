"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  CalendarDays,
  Globe,
  Shield,
  Sparkles,
  Star,
  UserCircle2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Script from "next/script";

export default function HomePage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Get session on client side
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setSession(data));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Lịch Vạn Niên Việt Nam",
    alternateName: ["Lịch Âm Dương Việt Nam", "Lịch Việt", "Xem Lịch Vạn Niên"],
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "10000",
      bestRating: "5",
      worstRating: "1",
    },
    description:
      "Xem lịch vạn niên Việt Nam 2026 online miễn phí. Tra cứu lịch âm dương chính xác, xem ngày tốt xấu, ngày lễ tết Việt Nam, can chi, giờ hoàng đạo. Lịch vạn niên online cập nhật liên tục, dễ sử dụng trên mọi thiết bị.",
    image: "/og-image.png",
    url: typeof window !== "undefined" ? window.location.origin : "",
    inLanguage: "vi-VN",
    featureList: [
      "Xem lịch vạn niên Việt Nam online",
      "Tra cứu lịch âm dương chính xác",
      "Xem ngày tốt xấu theo âm lịch",
      "Ngày lễ tết Việt Nam đầy đủ",
      "Can chi ngày tháng năm",
      "Giờ hoàng đạo hàng ngày",
      "Chuyển đổi âm dương lịch nhanh",
      "Lịch vạn sự tích hợp",
      "Giao diện thân thiện, hiện đại",
      "Responsive mọi thiết bị",
      "Miễn phí 100%",
      "Cập nhật liên tục",
    ],
    keywords:
      "lịch vạn niên, lịch vạn niên việt nam, xem lịch âm dương, tra cứu lịch vạn niên, ngày tốt xấu, can chi, giờ hoàng đạo, lịch việt nam online",
  };

  return (
    <>
      {/* Structured Data (JSON-LD) for SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="flex items-center justify-center px-4 py-20 relative overflow-hidden min-h-[calc(100vh-8rem)]">
        {/* Animated Background Elements - Dark Mode Compatible */}
        <div className="absolute inset-0 -z-10">
          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-blue-950/50 opacity-60" />

          <motion.div
            className="absolute top-20 left-10 w-64 h-64 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <motion.div
          className="max-w-5xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge - Dark Mode Compatible */}
          <motion.div
            className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 px-4 py-2 mb-8 backdrop-blur-sm"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Lịch Việt Nam Hiện Đại
            </span>
          </motion.div>

          {/* Title - Enhanced with Dark Mode */}
          <motion.h1
            className="text-6xl md:text-7xl font-bold tracking-tight mb-6"
            variants={itemVariants}
          >
            <motion.span
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Lịch Vạn Niên
            </motion.span>
            <br />
            <span className="text-gray-900 dark:text-gray-100">
              Việt Nam 2026
            </span>
          </motion.h1>

          {/* Description - Dark Mode Text */}
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Xem lịch vạn niên Việt Nam online miễn phí. Tra cứu lịch âm dương
            chính xác, xem ngày tốt xấu, giờ hoàng đạo, can chi, ngày lễ tết.
            Lịch vạn niên cập nhật liên tục, dễ sử dụng trên mọi thiết bị.
          </motion.p>

          {/* CTA Buttons */}
          {/* CTA Buttons - Dark Mode Enhanced */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pb-10"
            variants={itemVariants}
          >
            <Link
              href="/calendar"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 dark:hover:shadow-blue-500/25 hover:scale-105 transition-all"
            >
              <Calendar className="h-5 w-5" />
              <span>Xem Lịch Ngay</span>
              <motion.span className="group-hover:translate-x-1 transition-transform">
                →
              </motion.span>
            </Link>

            <Link
              href={session ? "/dashboard" : "/login"}
              className="inline-flex items-center gap-2 rounded-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              <UserCircle2 className="h-5 w-5" />
              <span>{session ? "Dashboard" : "Đăng Nhập"}</span>
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            id="features"
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {[
              {
                icon: CalendarDays,
                title: "Lịch Âm - Dương",
                description:
                  "Chuyển đổi dễ dàng giữa lịch dương và lịch âm, xem ngày giờ hoàng đạo",
                color: "blue",
                delay: 0,
              },
              {
                icon: Globe,
                title: "Ngày Lễ Tết",
                description:
                  "Đầy đủ thông tin các ngày lễ, tết Việt Nam và quốc tế",
                color: "indigo",
                delay: 0.1,
              },
              {
                icon: Sparkles,
                title: "Ghi Chú Cá Nhân",
                description:
                  "Thêm ghi chú, nhắc nhở cho các ngày quan trọng của bạn",
                color: "purple",
                delay: 0.2,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all"
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  transition: { type: "spring" as const, stiffness: 300 },
                }}
              >
                <motion.div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-950/30 text-${feature.color}-600 dark:text-${feature.color}-400 mb-4 group-hover:bg-${feature.color}-600 dark:group-hover:bg-${feature.color}-500 group-hover:text-white transition-colors`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="h-6 w-6" />
                </motion.div>
                <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
            variants={containerVariants}
          >
            {[
              { number: "10K+", label: "Người dùng", icon: Star },
              { number: "50+", label: "Ngày lễ", icon: CalendarDays },
              { number: "99.9%", label: "Uptime", icon: Zap },
              { number: "100%", label: "Bảo mật", icon: Shield },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white mb-3 shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <stat.icon className="h-6 w-6" />
                </motion.div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
