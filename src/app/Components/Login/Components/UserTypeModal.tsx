import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, UserCog } from 'lucide-react'

interface UserTypeModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (type: 'user' | 'coach') => void
}

export function UserTypeModal({ isOpen, onClose, onSelect }: UserTypeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-tr from-black to-slate-950 p-8 rounded-lg shadow-xl max-w-xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose Login Type</h2>
            <div className="flex justify-between gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="  flex gap-1 items-center justify-center space-x-2 p-2 sm:py-3 sm:px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md shadow-lg  transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                onClick={() => onSelect('user')}
              >
                <User size={22} className="mb-2" />
                <span>Standard Login</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex gap-1 items-center  bg-purple-600 hover:bg-purple-700 p-2 text-white font-bold sm:py-3 sm:px-4  rounded-lg transition duration-300 ease-in-out"
                onClick={() => onSelect('coach')}
              >
                <UserCog size={22} className="mb-2" />
                <span>Login as Coach</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
