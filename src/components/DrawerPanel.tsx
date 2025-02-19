"use client";

import { useState } from "react";
import { SignInForm } from "@/components/sign-in-form";
import { X } from "lucide-react"; // Close icon
import { motion, AnimatePresence } from "framer-motion"; // Smooth animation

export function DrawerPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Button to Open Drawer */}
      <button
        className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
        onClick={() => setIsOpen(true)}
      >
        Sign In
      </button>

      {/* Overlay Background */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            className="fixed top-0 right-0 w-96 h-full bg-gray-900 text-white shadow-xl z-50 p-6 flex flex-col"
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>

            {/* Sign-in Form */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
              <SignInForm />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
