"use client";
import React from 'react';
import Link from 'next/link';
import { Form } from './Form';

export const Waitlist = () => {
    return (
        <div className="min-h-screen font-sans relative overflow-hidden flex flex-col items-center justify-center">
            {/* Background Video with Blur */}
            <div className="absolute inset-0 w-full h-full z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover blur-md scale-105" // Added blur-md and scale-105 to prevent edge bleeding on blur
                >
                    <source src="/final.mp4" type="video/mp4" />
                </video>
                {/* Dark overlay for contrast */}
                <div className="absolute inset-0 bg-[#0F1C2D]/80" />
            </div>


            {/* Content Container */}
            <div className="relative z-10 w-full flex flex-col items-center">
                <Form />
            </div>
        </div>
    );
};
