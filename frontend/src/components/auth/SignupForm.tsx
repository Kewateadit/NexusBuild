'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, CheckCircle2, AlertCircle, Rocket } from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function SignupForm() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            const { data, error: signupError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                },
            });

            if (signupError) throw signupError;

            // Redirect to dashboard immediately
            router.push('/dashboard');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[2.5rem] p-10 shadow-2xl border-white/20 dark:border-white/5 max-w-md w-full"
        >
            <div className="flex flex-col gap-2 mb-10">
                <h2 className="text-3xl font-bold text-foreground tracking-tight">Create Account</h2>
                <p className="text-foreground/40 text-sm font-medium uppercase tracking-[0.2em]">Join NexusBuild Platform</p>
            </div>

            <form onSubmit={handleSignup} className="flex flex-col gap-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="text" 
                            required
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-foreground/[0.03] border border-foreground/5 focus:border-indigo-500/50 focus:bg-indigo-500/[0.02] outline-none rounded-2xl h-14 pl-12 pr-4 text-sm font-medium transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="email" 
                            required
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-foreground/[0.03] border border-foreground/5 focus:border-indigo-500/50 focus:bg-indigo-500/[0.02] outline-none rounded-2xl h-14 pl-12 pr-4 text-sm font-medium transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="password" 
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-foreground/[0.03] border border-foreground/5 focus:border-indigo-500/50 focus:bg-indigo-500/[0.02] outline-none rounded-2xl h-14 pl-12 pr-4 text-sm font-medium transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">Confirm Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="password" 
                            required
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-foreground/[0.03] border border-foreground/5 focus:border-indigo-500/50 focus:bg-indigo-500/[0.02] outline-none rounded-2xl h-14 pl-12 pr-4 text-sm font-medium transition-all"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <p className="text-xs text-red-500 font-bold leading-tight uppercase tracking-tight">{error}</p>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary w-full h-14 mt-4 shadow-indigo-600/20"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Create Account
                            <Rocket className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-8 border-t border-foreground/5 text-center">
                <p className="text-sm text-foreground/40 font-medium">
                    Already have an account? 
                    <a href="/login" className="ml-2 text-indigo-500 font-bold hover:underline underline-offset-4 transition-all">Sign In</a>
                </p>
            </div>
        </motion.div>
    );
}
