'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trash2, ExternalLink, BoxSelect } from 'lucide-react';

interface ProjectCardProps {
    id: string;
    name: string;
    imageUrl?: string;
    createdAt: string;
    onDelete: (id: string) => void;
    onOpen: (id: string) => void;
}

export default function ProjectCard({ id, name, imageUrl, createdAt, onDelete, onOpen }: ProjectCardProps) {
    const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="glass rounded-[2rem] overflow-hidden flex flex-col shadow-xl border-white/20 dark:border-white/5 group"
        >
            <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
                {imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt={name} 
                        className="w-full h-full object-contain rounded-xl group-hover:scale-110 transition-transform duration-700" 
                    />
                ) : (
                    <BoxSelect className="w-12 h-12 text-foreground/10 group-hover:text-indigo-500/20 transition-colors" />
                )}
                <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-colors duration-500"></div>
                
                <div className="absolute top-4 right-4 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                        onClick={() => onDelete(id)}
                        className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => onOpen(id)}
                        className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-lg hover:bg-indigo-50 transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="p-6 flex flex-col gap-4">
                <div className="space-y-1">
                    <h4 className="text-lg font-bold text-foreground truncate">{name}</h4>
                    <div className="flex items-center gap-2 text-[10px] font-black text-foreground/30 uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
