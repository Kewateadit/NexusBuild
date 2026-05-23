'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Target, Sparkles, Code, Terminal, Rocket, Users, ChevronRight, BoxSelect } from 'lucide-react';
import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background transition-colors duration-500 overflow-x-hidden">
            <Navbar />

            <main className="pt-40 pb-20 px-8 md:px-20 max-w-7xl mx-auto flex flex-col gap-32">
                {/* Vision Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-10 items-center text-center max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Our Mission</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-foreground leading-[1.05]">
                        Architectural <span className="text-indigo-600 dark:text-indigo-400 italic">Intelligence</span> for the Next Era
                    </h1>
                    <p className="text-xl text-foreground/50 font-medium leading-relaxed max-w-2xl">
                        NexusBuild was founded with a single vision: to bridge the gap between 2D architectural imagination and 3D structural reality using advanced spatial AI.
                    </p>
                </motion.section>

                {/* Timeline / Roadmap Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 py-20">
                    <div className="flex flex-col gap-12">
                        <h2 className="text-4xl font-bold tracking-tight text-foreground">Why we created <span className="text-indigo-600">NexusBuild</span></h2>
                        <div className="flex flex-col gap-8">
                            <Point item="The 2D Barrier" desc="Traditional architectural workflows often stall at the transition between flat floorplans and 3D BIM environments. NexusBuild eliminates this friction." />
                            <Point item="Spatial Precision" desc="Manual tracing is prone to human error. Our AI-driven reconstruction ensures topological manifoldness and geometric accuracy from the start." />
                            <Point item="Developer-First" desc="Built with a robust FastAPI backend and real-time WebGL rendering, NexusBuild is designed for high-performance architectural teams." />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-600/5 rounded-[3rem] blur-3xl"></div>
                        <div className="relative glass p-12 rounded-[3rem] flex flex-col gap-8 border-indigo-500/10 shadow-2xl shadow-indigo-500/5">
                            <h3 className="text-2xl font-bold text-foreground">Our Core Stack</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <StackItem icon={<Terminal className="w-5 h-5" />} name="FastAPI" />
                                <StackItem icon={<Code className="w-5 h-5" />} name="OpenCV" />
                                <StackItem icon={<Rocket className="w-5 h-5" />} name="Next.js" />
                                <StackItem icon={<Box className="w-5 h-5" />} name="Babylon.js" />
                            </div>
                            <div className="h-px bg-foreground/5 w-full"></div>
                            <div className="flex flex-col gap-4">
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Future Roadmap</p>
                                <div className="flex flex-col gap-3">
                                    <RoadmapItem text="Semantic Room understanding" done={true} />
                                    <RoadmapItem text="AR Integration" done={false} />
                                    <RoadmapItem text="Collaborative Workspace" done={false} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team / Visionary Section */}
                <section className="py-20 flex flex-col gap-20">
                    <div className="flex flex-col gap-6 text-center max-w-2xl mx-auto">
                        <h2 className="text-4xl font-bold text-foreground tracking-tight">Built by Architects for Architects</h2>
                        <p className="text-lg text-foreground/50 font-medium leading-relaxed">
                            We are a global team of architectural designers, computer vision researchers, and spatial software engineers.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <ValueCard icon={<Heart className="w-6 h-6" />} title="Passion" desc="We believe in the beauty of structural geometry and the power of clean code." />
                        <ValueCard icon={<Target className="w-6 h-6" />} title="Precision" desc="Architectural software should never guess. We prioritize geometric truth above all else." />
                        <ValueCard icon={<Sparkles className="w-6 h-6" />} title="Innovation" desc="Constant experimentation with the latest in AI and WebGL performance." />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function Point({ item, desc }: { item: string, desc: string }) {
    return (
        <div className="flex flex-col gap-2 group">
            <h4 className="text-xl font-bold text-foreground group-hover:text-indigo-600 transition-colors">{item}</h4>
            <p className="text-base text-foreground/40 font-medium leading-relaxed">{desc}</p>
        </div>
    );
}

function StackItem({ icon, name }: { icon: any, name: string }) {
    return (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-foreground/5 border border-foreground/5">
            <div className="text-indigo-500">{icon}</div>
            <span className="text-sm font-bold text-foreground">{name}</span>
        </div>
    );
}

function RoadmapItem({ text, done }: { text: string, done: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${done ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
            <span className={`text-xs font-bold ${done ? 'text-foreground/60' : 'text-foreground/30 uppercase tracking-widest'}`}>{text}</span>
        </div>
    );
}

function ValueCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-10 glass rounded-3xl border-foreground/5 flex flex-col gap-6 hover:-translate-y-2 transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                {icon}
            </div>
            <div className="flex flex-col gap-3">
                <h4 className="text-2xl font-bold text-foreground tracking-tight">{title}</h4>
                <p className="text-sm text-foreground/40 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function Box({ className }: { className?: string }) {
    return <BoxSelect className={className} />;
}
