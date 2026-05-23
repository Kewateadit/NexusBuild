'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Box, Layers, Zap, Activity, BoxSelect, Search, Code, Brain } from 'lucide-react';
import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function ArchitecturePage() {
    return (
        <div className="min-h-screen bg-background transition-colors duration-500 overflow-x-hidden">
            <Navbar />

            <main className="pt-40 pb-20 px-8 md:px-20 max-w-7xl mx-auto flex flex-col gap-32">
                {/* Header Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-6 max-w-3xl"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Internal System Design</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-tight">
                        Inside the <span className="text-indigo-600 dark:text-indigo-400">NexusBuild</span> Intelligence Engine
                    </h1>
                    <p className="text-xl text-foreground/50 font-medium leading-relaxed">
                        A deep dive into the computer vision pipeline and geometric algorithms that transform 2D rasters into clean structural 3D architecture.
                    </p>
                </motion.section>

                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    <FeatureBlock
                        title="Sophisticated Computer Vision"
                        icon={<Activity className="w-8 h-8" />}
                        description="Our proprietary OpenCV pipeline manages multi-stage image preprocessing including adaptive Gaussian thresholding, morphological solidification, and topological skeletonization. This ensures raw floorplans are cleaned of noise and decorative artifacts before vector extraction."
                        points={["Adaptive Thresholding", "Structural Solidification", "Artifact Removal"]}
                    />

                    <FeatureBlock
                        title="Hough Vectorization"
                        icon={<BoxSelect className="w-8 h-8" />}
                        description="Utilizing a Probabilistic Hough Transform (PHT) pipeline, we extract linear segments with sub-pixel precision. The engine intelligently identifies structural wall candidates, hallway partitions, and room dividers while maintaining manifold connectivity."
                        points={["Probabilistic Hough Transforms", "Segment Consolidation", "Structural Candidate Scoring"]}
                    />

                    <FeatureBlock
                        title="Reconstruction Pipeline"
                        icon={<Cpu className="w-8 h-8" />}
                        description="The transition from Raster to Vector to 3D occurs within an 8-stage topological orchestrator. This converts pixel-space coordinates into a normalized geometric coordinate system ready for real-time 3D extrusion and BIM-compatible exports."
                        points={["Raster-to-Vector Normalization", "Topological Skeletonization", "Coordinate Mapping"]}
                    />

                    <FeatureBlock
                        title="Babylon.js Engine"
                        icon={<Box className="w-8 h-8" />}
                        description="Our real-time rendering core uses Babylon.js to perform high-performance structural extrusion. We render structural massing with studio-quality clay materials and cinematic lighting, providing architects with an immediate spatial understanding."
                        points={["Structural Extrusion", "Clay Render Materials", "Real-time Shadowing"]}
                    />
                </div>

                {/* Future AI Section */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-16 rounded-[3rem] glass flex flex-col gap-10 items-center text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-violet-500/5 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-[0.03] pointer-events-none"></div>

                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl">
                        <Brain className="w-8 h-8" />
                    </div>

                    <div className="flex flex-col gap-4 max-w-2xl">
                        <h2 className="text-4xl font-bold text-foreground tracking-tight">Future AI Integration</h2>
                        <p className="text-lg text-foreground/50 font-medium leading-relaxed">
                            We are currently training transformer-based models for semantic room understanding and automated BIM metadata generation. The future of NexusBuild is a fully autonomous architectural partner.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-10">
                        {["Semantic Understanding", "AR Integration", "Generative design"].map(item => (
                            <div key={item} className="p-6 rounded-2xl bg-foreground/5 border border-foreground/5 text-xs font-black uppercase tracking-widest text-indigo-500">
                                {item}
                            </div>
                        ))}
                    </div>
                </motion.section>
            </main>

            <Footer />
        </div>
    );
}

function FeatureBlock({ title, icon, description, points }: { title: string, icon: any, description: string, points: string[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8 group"
        >
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    {icon}
                </div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">{title}</h3>
            </div>
            <p className="text-base text-foreground/50 font-medium leading-relaxed">
                {description}
            </p>
            <div className="flex flex-wrap gap-3">
                {points.map(p => (
                    <span key={p} className="px-4 py-2 rounded-xl bg-foreground/5 text-[10px] font-bold text-foreground/40 uppercase tracking-widest group-hover:text-indigo-500 transition-colors">
                        {p}
                    </span>
                ))}
            </div>
            <div className="h-px w-full bg-foreground/5"></div>
        </motion.div>
    );
}
