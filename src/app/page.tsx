"use client";

import Footer from "@/components/custom/Footer";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Globe,
  Shield,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
        type: "spring",
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

  return (
    <div className="flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-10 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"
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
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 mb-8"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            Lịch Việt Nam Hiện Đại
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-6xl md:text-7xl font-bold tracking-tight mb-6"
          variants={itemVariants}
        >
          <motion.span
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
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
            Lịch Âm - Dương
          </motion.span>
          <br />
          <span className="text-gray-900">Việt Nam</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Tra cứu lịch Việt Nam với đầy đủ thông tin ngày lễ, tết, âm lịch. Giao
          diện hiện đại, dễ sử dụng.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
          variants={itemVariants}
        >
          {session ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              >
                Vào Dashboard
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              >
                Bắt đầu ngay
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 rounded-full border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              Tìm hiểu thêm
            </Link>
          </motion.div>
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
              className="group rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm p-8 hover:shadow-xl hover:border-blue-200 transition-all"
              variants={itemVariants}
              whileHover={{
                y: -10,
                transition: { type: "spring", stiffness: 300 },
              }}
            >
              <motion.div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${feature.color}-100 text-${feature.color}-600 mb-4 group-hover:bg-${feature.color}-600 group-hover:text-white transition-colors`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="h-6 w-6" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
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
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white mb-3"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <stat.icon className="h-6 w-6" />
              </motion.div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
}
