"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { Calendar, UserCog, HeartPulse, GamepadIcon, UserCircle, LogOut, Menu, X } from "lucide-react"

const menuItems = [
  { icon: Calendar, label: "Event Management", href: "/dashboard/event-management" },
  { icon: UserCog, label: "Coach Hiring", href: "/dashboard/coaches" },
  { icon: HeartPulse, label: "Health Record", href: "/dashboard/health-record" },
  { icon: GamepadIcon, label: "Game Suggestion", href: "/dashboard/game-suggestions" },
  { icon: UserCircle, label: "User Profile", href: "/dashboard/user-profile" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold text-white">Sportify Weather</h1>
          <div className="w-6"></div> {/* Placeholder for balance */}
        </div>
      </nav>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 bottom-0 z-40 w-64 bg-gradient-to-b from-black via-blue-950 to-gray-950 border-r border-gray-800 transition-transform duration-300 ease-in-out transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full pt-16 md:pt-0">
          {/* Header */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive ? "bg-blue-500 text-white" : "text-gray-300 hover:bg-white/10"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-gray-400"}`} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 mt-auto">
            <button
              onClick={() => console.log("Sign Out")}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

