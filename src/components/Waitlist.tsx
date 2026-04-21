"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Form } from './Form';
import { WaitlistCounter } from './WaitlistCounter';

export const Waitlist = () => {
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (
                e.key === 'F12' ||
                ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                ((e.ctrlKey || e.metaKey) && e.key === 'u')
            ) {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

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

            <nav className="absolute top-0 left-0 right-0 z-[60] flex items-center justify-center px-8 py-6 bg-transparent">
                <div className="flex items-center gap-5">
                    {/* Pulsing Orb SVG */}
                    <svg width="40" height="40" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                        <defs>
                            <filter id="simmer-nav" x="-20%" y="-20%" width="140%" height="140%">
                                <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise">
                                    <animate attributeName="seed" from="1" to="100" dur="15s" repeatCount="indefinite" />
                                </feTurbulence>
                                <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
                            </filter>
                            <filter id="heavy-static-nav">
                                <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" result="grain">
                                    <animate attributeName="seed" from="1" to="100" dur="4s" repeatCount="indefinite" />
                                </feTurbulence>
                                <feColorMatrix type="saturate" values="0" />
                                <feComponentTransfer>
                                    <feFuncA type="linear" slope="0.35" />
                                </feComponentTransfer>
                                <feComposite operator="in" in2="SourceGraphic" />
                            </filter>
                            <linearGradient id="orbGradNav" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="var(--background)" />
                                <stop offset="30%" stopColor="var(--navy-1)" />
                                <stop offset="65%" stopColor="var(--gray-1)" />
                                <stop offset="85%" stopColor="var(--accent)" />
                                <stop offset="100%" stopColor="var(--foreground)" />
                            </linearGradient>
                            <clipPath id="circleClipNav">
                                <circle cx="100" cy="100" r="85" />
                            </clipPath>
                        </defs>
                        <g clipPath="url(#circleClipNav)">
                            <rect width="200" height="200" fill="url(#orbGradNav)" filter="url(#simmer-nav)" />
                            <circle cx="100" cy="140" r="55" fill="#F4F8FB" opacity="0.25" filter="url(#simmer-nav)">
                                <animate attributeName="opacity" values="0.15;0.35;0.15" dur="5s" repeatCount="indefinite" />
                            </circle>
                        </g>
                        <circle cx="100" cy="100" r="85" filter="url(#heavy-static-nav)" pointerEvents="none" />
                    </svg>
                    <Link href="/" className="cursor-pointer flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-32 sm:w-40 md:w-48 lg:w-[180px] h-auto text-foreground" viewBox="0 0 218 29" fill="none">
                            <path d="M0.91259 27.2335L11.1881 0.824195H14.3962L24.6717 27.2335H20.9056L17.9299 19.7478H7.60792L4.67871 27.2335H0.91259ZM8.86329 16.5396H16.721L12.7689 6.17116L8.86329 16.5396Z" fill="currentColor" />
                            <path d="M35.6704 19.7943C35.6704 22.5375 37.0652 23.8859 39.8085 23.8859H47.7592V27.2335H39.576C34.601 27.2335 32.1367 24.8158 32.1367 19.8408V0.824195H35.6704V19.7943Z" fill="currentColor" />
                            <path d="M60.0132 19.7943C60.0132 22.5375 61.4081 23.8859 64.1513 23.8859H72.102V27.2335H63.9188C58.9438 27.2335 56.4796 24.8158 56.4796 19.8408V0.824195H60.0132V19.7943Z" fill="currentColor" />
                            <path d="M90.9824 27.7915C83.4036 27.7915 78.8936 21.9796 78.8936 14.1219C78.8936 6.21765 83.4036 0.312745 90.9824 0.312745C98.4681 0.312745 103.025 6.21765 103.025 14.1219C103.025 21.9796 98.4681 27.7915 90.9824 27.7915ZM90.9824 24.4438C96.3758 24.4438 99.4445 19.9803 99.4445 14.1219C99.4445 8.17045 96.4688 3.66041 90.9824 3.66041C85.4029 3.66041 82.4272 8.17045 82.4272 14.1219C82.4272 19.9803 85.5424 24.4438 90.9824 24.4438Z" fill="currentColor" />
                            <path d="M112.249 0.824195H121.734C126.616 0.824195 130.01 3.98588 130.01 8.6819C130.01 12.2155 128.243 14.9123 125.035 16.0747C125.732 16.7256 126.29 17.8415 126.895 19.2828L130.149 27.2335H126.011L123.175 20.3987C122.292 18.2134 121.408 16.9116 119.362 16.9116H115.782V27.2335H112.249V0.824195ZM115.782 13.5639H121.641C124.57 13.5639 126.43 11.4251 126.43 8.7284C126.43 6.03167 124.663 4.21835 121.734 4.21835H115.782V13.5639Z" fill="currentColor" />
                            <path d="M143.299 8.26344V12.355H155.295V15.7492H143.299V20.3987C143.299 22.863 144.368 23.8859 146.786 23.8859H157.294V27.2335H147.344C142.276 27.2335 139.765 24.7693 139.765 19.7013V8.40293C139.765 3.33494 142.276 0.824195 147.344 0.824195H157.294V4.21835H147.158C144.787 4.21835 143.299 5.65971 143.299 8.26344Z" fill="currentColor" />
                            <path d="M180.984 27.2335L191.259 0.824195H194.467L204.743 27.2335H200.977L198.001 19.7478H187.679L184.75 27.2335H180.984ZM188.935 16.5396H196.792L192.84 6.17116L188.935 16.5396Z" fill="currentColor" />
                            <path d="M213.843 27.2335V0.824195H217.376V27.2335H213.843Z" fill="currentColor" />
                        </svg>
                    </Link>
                </div>
            </nav>


            {/* Content Container */}
            <div className="relative z-10 w-full flex flex-col items-center">
                <Form />
            </div>

            {/* Waitlist Counter */}
            <WaitlistCounter />
        </div>
    );
};
