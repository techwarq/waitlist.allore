"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const WaitlistCounter = () => {
    const [count, setCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await fetch(`${API_URL}/api/w-v1`);
                if (!response.ok) {
                    throw new Error('Failed to fetch count');
                }
                const data = await response.json();
                setCount(data.count);
                setError(false);
            } catch (err) {
                console.error('Error fetching waitlist count:', err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCount();

        // Optionally refresh count every 30 seconds
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, []);

    if (error) {
        return null; // Gracefully hide on error
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-30"
        >
            <div className="relative group">
                {/* Glassmorphism container */}
                <div
                    className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-6 py-4 shadow-2xl hover:shadow-[0_20px_60px_rgba(24,169,153,0.3)] transition-all duration-300 hover:scale-105"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    }}
                >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#18A999]/20 to-[#0F1C2D]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />

                    <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#18A999] to-[#0F1C2D] shadow-lg">
                            <Users className="w-5 h-5 text-white" />
                        </div>

                        {/* Count display */}
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                                On Waitlist
                            </span>
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-7 w-16 bg-white/20 rounded animate-pulse"
                                    />
                                ) : (
                                    <motion.div
                                        key={count}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-2xl font-bold text-white tabular-nums"
                                    >
                                        {count?.toLocaleString() || '0'}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Subtle pulse animation */}
                    <motion.div
                        className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#18A999] to-[#0F1C2D] opacity-20 blur-md -z-20"
                        animate={{
                            opacity: [0.2, 0.3, 0.2],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
};
