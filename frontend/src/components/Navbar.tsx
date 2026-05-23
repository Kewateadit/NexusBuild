'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, User, LayoutDashboard, Settings, 
  HelpCircle, LogOut, ChevronDown, Activity,
  Layers, Info
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { handleLogout } from '@/lib/auth/logout';

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const menuItems = [
        { label: 'Home', href: '/' },
        { label: 'Architecture', href: '/architecture' },
        { label: 'About', href: '/about' }
    ];

    const dropdownItems = [
        { label: 'Profile', icon: <User className="w-4 h-4" />, href: '/profile' },
        { label: 'Settings', icon: <Settings className="w-4 h-4" />, href: '/settings' },
        { label: 'Workspace', icon: <Layers className="w-4 h-4" />, href: '/workspace' },
        { label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, href: '/dashboard' },
        { label: 'Logout', icon: <LogOut className="w-4 h-4" />, href: '#', danger: true, onClick: handleLogout }
    ];

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-7xl h-16 glass rounded-full z-[100] flex items-center justify-between px-8 shadow-2xl transition-all duration-500 border border-white/20 dark:border-white/5"
        >
            <Link href="/" className="flex items-center gap-3 cursor-pointer">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
                    <span className="text-white font-black text-sm italic">NB</span>
                </div>
                <div className="hidden sm:flex flex-col">
                    <h1 className="text-foreground font-bold text-sm leading-none tracking-tight">NexusBuild</h1>
                    <p className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-0.5">AI Architectural Intelligence</p>
                </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
                {menuItems.map((item) => (
                    <Link 
                        key={item.label}
                        href={item.href}
                        className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                            pathname === item.href ? 'text-indigo-600 dark:text-indigo-400' : 'text-foreground/40 hover:text-indigo-500'
                        }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <button 
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-foreground/5 transition-all text-foreground border border-foreground/5"
                >
                    <AnimatePresence mode="wait">
                        {theme === 'dark' ? (
                            <motion.div key="moon" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Moon className="w-4 h-4" /></motion.div>
                        ) : (
                            <motion.div key="sun" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Sun className="w-4 h-4" /></motion.div>
                        )}
                    </AnimatePresence>
                </button>

                <div className="h-4 w-px bg-foreground/10 mx-1"></div>

                {/* Auth / Profile Section */}
                {loading ? (
                    <div className="w-9 h-9 rounded-full bg-foreground/5 animate-pulse"></div>
                ) : user ? (
                    <div className="relative">
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 p-1.5 rounded-full hover:bg-foreground/5 transition-all border border-foreground/5 group"
                        >
                            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px] relative">
                                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-foreground/40 group-hover:text-foreground transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-14 right-0 w-56 glass rounded-2xl p-2 shadow-2xl border border-white/20 dark:border-white/5 z-[110]"
                                >
                                    <div className="p-3 mb-2 border-b border-foreground/5">
                                        <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1">Signed in as</p>
                                        <p className="text-sm font-bold text-foreground truncate">{user.user_metadata?.full_name || 'Architect'}</p>
                                        <p className="text-[10px] text-foreground/40 font-medium truncate">{user.email}</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {dropdownItems.map((item) => (
                                            <button 
                                                key={item.label}
                                                onClick={() => {
                                                    if (item.onClick) item.onClick();
                                                    else router.push(item.href);
                                                    setIsProfileOpen(false);
                                                }}
                                                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all w-full text-left ${
                                                    item.danger 
                                                    ? 'text-red-500 hover:bg-red-500/10' 
                                                    : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                                                }`}
                                            >
                                                {item.icon}
                                                <span className="text-xs font-bold">{item.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-foreground/60 hover:text-foreground transition-colors px-4">
                            Login
                        </Link>
                        <Link href="/signup" className="btn-primary h-9 text-[10px] px-6 shadow-indigo-600/10">
                            Join Now
                        </Link>
                    </div>
                )}
            </div>
        </motion.nav>
    );
}
