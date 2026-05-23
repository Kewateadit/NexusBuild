'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import ProjectGrid from '@/components/dashboard/ProjectGrid';
import { motion } from 'framer-motion';
import { LayoutGrid, Plus } from 'lucide-react';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background transition-colors duration-500 overflow-x-hidden flex flex-col">
            <Navbar />
            
            <main className="flex-1 pt-40 pb-20 px-8 md:px-20 max-w-[1600px] mx-auto w-full flex flex-col gap-12">
                <div className="flex flex-col gap-4">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit"
                    >
                        <LayoutGrid className="w-3 h-3 text-indigo-500" />
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Project Repository</span>
                    </motion.div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                        <div className="space-y-2">
                            <h1 className="text-5xl font-bold text-foreground tracking-tight">Your Dashboard</h1>
                            <p className="text-lg text-foreground/40 font-medium italic">Manage and view your 3D architectural reconstructions.</p>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-foreground/5 w-full"></div>

                <ProjectGrid />
            </main>

            <Footer />
        </div>
    );
}
