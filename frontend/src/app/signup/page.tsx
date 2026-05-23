'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import SignupForm from '@/components/auth/SignupForm';
import { motion } from 'framer-motion';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-background transition-colors duration-500 overflow-x-hidden flex flex-col">
            <Navbar />
            
            <main className="flex-1 pt-48 pb-32 px-8 flex flex-col items-center justify-center relative">
                {/* Background Decorations */}
                <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[150px] -z-10 animate-pulse"></div>
                <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[150px] -z-10"></div>

                <div className="w-full flex flex-col items-center gap-8">
                    <div className="text-center space-y-4 mb-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit mx-auto"
                        >
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Join the Future of BIM</span>
                        </motion.div>
                    </div>

                    <SignupForm />
                </div>
            </main>

            <Footer />
        </div>
    );
}
