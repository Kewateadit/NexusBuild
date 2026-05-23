'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { 
  Upload, BoxSelect, ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function Home() {
    const router = useRouter();

    const goToWorkspace = () => {
        router.push('/workspace');
    };

    return (
        <div className="min-h-screen bg-background transition-colors duration-500 overflow-x-hidden">
            <Navbar />
            
            <main>
                <LandingSection triggerUpload={goToWorkspace} />
            </main>

            <Footer />
        </div>
    );
}

function LandingSection({ triggerUpload }: { triggerUpload: () => void }) {
    return (
        <section className="min-h-screen px-8 md:px-20 pt-48 pb-32 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-10"
            >
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">AI Architectural Intelligence Platform</span>
                </div>

                <h2 className="text-7xl font-bold tracking-tight text-foreground leading-[1.05] max-w-xl">
                    Transform 2D Floorplans into <span className="text-indigo-600 dark:text-indigo-400">Intelligent 3D Spaces</span>
                </h2>

                <p className="text-xl text-foreground/40 font-medium leading-relaxed max-w-lg">
                    AI-powered architectural reconstruction engine that converts floorplans into clean structural 3D models in seconds.
                </p>

                <div className="flex flex-col sm:flex-row gap-5">
                    <button onClick={triggerUpload} className="btn-primary shadow-indigo-500/20 group">
                        Get Started
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={triggerUpload} className="btn-secondary">
                        Upload Floorplan
                        <Upload className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>

            {/* HERO VISUAL */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative group h-full flex items-center justify-center"
            >
                <div className="relative z-10 w-full aspect-[4/3] glass rounded-[3rem] p-8 overflow-hidden flex items-center justify-center border-white/20 dark:border-white/5 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-violet-500/5 pointer-events-none"></div>
                    <img 
                        src="/model.png" 
                        alt="Nexus AI Transformation" 
                        className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-[4s] ease-out" 
                    />
                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                </div>
                
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-violet-600/10 rounded-full blur-[120px]"></div>
            </motion.div>
        </section>
    );
}
