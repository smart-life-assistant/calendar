"use client";

import { motion } from "framer-motion";
import { Calendar, Github, Heart, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-2">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Lịch Việt
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Ứng dụng xem lịch Việt Nam hiện đại với đầy đủ thông tin âm lịch,
              ngày lễ tết và sự kiện.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Mail, href: "#", label: "Email" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              Liên kết
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Trang chủ" },
                { href: "/calendar", label: "Xem lịch" },
                { href: "/dashboard", label: "Dashboard" },
                { href: "#", label: "Giới thiệu" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              Tài nguyên
            </h3>
            <ul className="space-y-2">
              {[
                { href: "#", label: "API Documentation" },
                { href: "#", label: "Hướng dẫn sử dụng" },
                { href: "#", label: "Câu hỏi thường gặp" },
                { href: "#", label: "Liên hệ" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              Pháp lý
            </h3>
            <ul className="space-y-2">
              {[
                { href: "#", label: "Điều khoản sử dụng" },
                { href: "#", label: "Chính sách bảo mật" },
                { href: "#", label: "Cookie Policy" },
                { href: "#", label: "Bản quyền" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            © 2025 Lịch Việt. Made with{" "}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            </motion.span>{" "}
            in Vietnam 🇻🇳
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>v1.0.0</span>
            <span>•</span>
            <Link href="#" className="hover:text-foreground transition-colors">
              Changelog
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
