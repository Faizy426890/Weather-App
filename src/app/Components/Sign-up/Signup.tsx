'use client'

import { useState } from 'react'
import { AuthLayout } from '../AuthLayout/AuthLayout'
import { Input } from '../ui/Input/Input' 
import { ToastContainer, toast } from 'react-toastify'; 
import { motion } from "framer-motion"

import { Button } from '../ui/Button/Button' 
import Loader from '../ui/Loader/Loader';
export default function SignUp() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<any>('') 
  const [username , setUserName] = useState<string>('')   
  const [loading,setLoading] = useState<boolean>(false);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  
    setLoading(true);
  
    const data = { 
      username: username, 
      email: email, 
      password: password,
    }; 
    try { 
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });  
  
      const responseData = await res.json();
      console.log(responseData); 
      toast(responseData.message);
    } catch (error) {
      console.error('Error during sign-up:', error);
    } 
    finally{ 
      setLoading(false);
    }
  };
  

  return (
    <AuthLayout  
      title="Create your account"
      subtitle="Sign up to get started"
      alternativeAction="Already have an account? Sign in"
      alternativeActionLink="/login"
    >   
    <ToastContainer/> 
    <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 p-8 bg-gray-800 rounded-xl border border-gray-700 shadow-2xl"
      >
        <div className="rounded-md shadow-sm space-y-2"> 
        <Input
            id="username"
            name="username"
            type="name"
            autoComplete="name"
            required
            label="Username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
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

        <Button
          disabled={loading}
          type="submit"
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? (
            <Loader />
          ) : (
            <>
              <span>Sign Up</span>
            </>
          )}
        </Button>
      </motion.form>
    </AuthLayout>
  )
}

