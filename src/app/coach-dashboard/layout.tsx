'use client'
import { Navbar } from "./components/navbar"
import { useState , useEffect } from "react"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) { 
     const [isMounted, setIsMounted] = useState(false)
    
      useEffect(() => {
        setIsMounted(true)
      }, [])
    
      if (!isMounted) {
        return null // or a loading spinner
      }
  return (
    <html lang="en"> 

      <body> 
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 ">
        <Navbar />
        <div className="lg:pl-64">
          <main className="pt-16 lg:p-8">{children}</main>
        </div> 
        </div>
      </body>
    </html>
  )
} 