"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AuthLayout } from "../AuthLayout/AuthLayout"
import { Input } from "../ui/Input/Input"
import Loader from "../ui/Loader/Loader"
import { ToastContainer, toast } from "react-toastify"
import { Button } from "../ui/Button/Button"
import { UserTypeModal } from "./Components/UserTypeModal"
import { LogIn, User } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate login process
    setTimeout(() => {
      setLoading(false)
      setModalOpen(true)
    }, 1500)
  }

  const handleUserTypeSelect = (type: "user" | "coach") => {
    setModalOpen(false)
    if (type === "user") {
      router.push("/dashboard")
    } else {
      router.push("/coach-dashboard")
    }
  }

  return (
    <AuthLayout
      title="Login To Your Account"
      subtitle="Enter your credentials to access your account"
      alternativeAction="Don't have an account? Sign up"
      alternativeActionLink="/sign-up"
    >
      <ToastContainer />
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 p-8 bg-gray-800 rounded-xl border border-gray-700 shadow-2xl"
      >
        <div className="space-y-6">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            name="password"
            type="password"
            required
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <a
              href="/forgot-password"
              className="font-medium text-indigo-400 hover:text-indigo-300 transition duration-300"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <Button
          disabled={loading}
          type="submit"
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? (
            <Loader />
          ) : (
            <>
              <LogIn size={20} />
              <span>Login</span>
            </>
          )}
        </Button>
      </motion.form>

      <UserTypeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSelect={handleUserTypeSelect} />
    </AuthLayout>
  )
}

