'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import LoginForm from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

import { useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const searchParams = useSearchParams();
    const verified = searchParams.get('verified') === 'true';
    const error = searchParams.get('error');

    return (
        <div className="min-h-screen bg-background transition-colors duration-500 overflow-x-hidden flex flex-col">
            <Navbar />
            
            <main className="flex-1 pt-48 pb-32 px-8 flex flex-col items-center justify-center relative">
                {/* Background Decorations */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] -z-10"></div>

                <div className="w-full flex flex-col items-center gap-8">
                    <div className="text-center space-y-4 mb-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit mx-auto"
                        >
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Secure Authentication</span>
                        </motion.div>
                    </div>

                    <div className="max-w-md w-full space-y-6">
                        {verified && (
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass rounded-3xl p-6 border-green-500/20 shadow-xl flex items-center gap-4 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-green-500/5 -z-10"></div>
                                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground leading-tight">Email Verified Successfully</h4>
                                    <p className="text-[10px] text-foreground/50 font-medium mt-1">Your account is now active. You can safely login.</p>
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass rounded-3xl p-6 border-red-500/20 shadow-xl flex items-center gap-4 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-red-500/5 -z-10"></div>
                                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center shrink-0">
                                    <AlertCircle className="w-6 h-6 text-red-500" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground leading-tight">Verification Problem</h4>
                                    <p className="text-[10px] text-foreground/50 font-medium mt-1">{error === 'verification_failed' ? 'The verification link was invalid or has already been used.' : error}</p>
                                </div>
                            </motion.div>
                        )}

                        <LoginForm />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
