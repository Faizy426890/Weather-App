'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Activity, Award, UserCircle, LogOut } from 'lucide-react'

const menuItems = [
  { icon: Activity, label: 'Status', href: '/coach/status' },
  { icon: Award, label: 'Coach Specifications', href: '/coach/specifications' },
  { icon: UserCircle, label: 'My Profile', href: '/coach/profile' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b  from-black via-blue-950 to-slate-950  backdrop-blur-xl border-r border-white/10"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white">Coach Portal</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <motion.li
                  key={item.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 mt-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => console.log('Logout')}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
