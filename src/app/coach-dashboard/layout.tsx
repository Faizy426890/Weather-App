"use client"

import { Sidebar } from "./components/sidebar"
import { motion } from "framer-motion"

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 ">
      <Sidebar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="ml-64 min-h-screen"
      >
        <main className="p-8">{children}</main>
      </motion.div>
    </div>
  )
}

