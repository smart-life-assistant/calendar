"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Award,
  CalendarDays,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";

export default function DashboardPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const cardHoverVariants = {
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Title */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-gray-600 mt-1">
          Chào mừng trở lại! Đây là tổng quan hệ thống của bạn.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
      >
        {[
          {
            icon: CalendarDays,
            value: "24",
            label: "Ngày lễ sắp tới",
            trend: "+12%",
            color: "blue",
          },
          {
            icon: Users,
            value: "1",
            label: "Người dùng",
            trend: "+8%",
            color: "indigo",
          },
          {
            icon: TrendingUp,
            value: "145",
            label: "Lượt truy cập",
            trend: "+23%",
            color: "purple",
          },
          {
            icon: Clock,
            value: "7 ngày",
            label: "Session timeout",
            trend: "Active",
            color: "green",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            variants={itemVariants}
            whileHover="hover"
            custom={cardHoverVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <motion.div
                className={`rounded-lg bg-${stat.color}-100 p-3`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </motion.div>
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === "Active" ? "text-green-600" : "text-green-600"
                }`}
              >
                {stat.trend !== "Active" && (
                  <ArrowUpRight className="h-3 w-3" />
                )}
                {stat.trend}
              </span>
            </div>
            <motion.h3
              className="text-2xl font-bold text-gray-900"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring" }}
            >
              {stat.value}
            </motion.h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Content Grid */}
      <motion.div
        className="grid gap-6 lg:grid-cols-2"
        variants={containerVariants}
      >
        {/* Recent Activity */}
        <motion.div
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          variants={itemVariants}
          whileHover={cardHoverVariants.hover}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Hoạt động gần đây
            </h2>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="h-5 w-5 text-gray-400" />
            </motion.div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                </motion.div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Đã thêm ngày lễ mới
                  </p>
                  <p className="text-xs text-gray-500">{i * 2} giờ trước</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          variants={itemVariants}
          whileHover={cardHoverVariants.hover}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Thống kê nhanh
            </h2>
            <Award className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {[
              { label: "Ngày lễ quốc gia", value: 18, max: 24, color: "blue" },
              {
                label: "Ngày lễ tôn giáo",
                value: 12,
                max: 24,
                color: "indigo",
              },
              { label: "Ngày đặc biệt", value: 6, max: 24, color: "purple" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.value}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <motion.div
                    className={`h-2 rounded-full bg-${item.color}-600`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / item.max) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Chart Section */}
      <motion.div
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        variants={itemVariants}
        whileHover={cardHoverVariants.hover}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Biểu đồ hoạt động
        </h2>
        <div className="h-64 flex items-end justify-between gap-2">
          {[40, 70, 45, 80, 55, 90, 65].map((height, index) => (
            <motion.div
              key={index}
              className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-600 rounded-t-lg"
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, opacity: 0.8 }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
