'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import ProjectCard from './ProjectCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderPlus, Loader2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProjectGrid() {
    const router = useRouter();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (err) {
            console.error("Failed to fetch projects:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setProjects(projects.filter(p => p.id !== id));
        } catch (err) {
            console.error("Failed to delete project:", err);
        }
    };

    const filteredProjects = projects.filter(p => 
        p.project_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="w-full py-20 flex flex-col items-center justify-center gap-6">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em]">Synchronizing Workspace...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                <div className="relative w-full md:w-[400px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-12 bg-foreground/5 border border-foreground/5 focus:border-indigo-500/50 outline-none rounded-2xl pl-12 pr-4 text-sm transition-all"
                    />
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <button onClick={() => router.push('/workspace')} className="flex-1 md:flex-none btn-primary h-12 text-xs px-6 shadow-indigo-600/20">
                        <FolderPlus className="w-4 h-4" />
                        New Project
                    </button>
                </div>
            </div>

            {/* Grid */}
            <AnimatePresence mode="popLayout">
                {filteredProjects.length > 0 ? (
                    <motion.div 
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        {filteredProjects.map((project) => (
                            <ProjectCard 
                                key={project.id}
                                id={project.id}
                                name={project.project_name}
                                imageUrl={project.floorplan_url}
                                createdAt={project.created_at}
                                onDelete={handleDelete}
                                onOpen={(id) => router.push(`/workspace?id=${id}`)}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass rounded-[3rem] p-20 flex flex-col items-center justify-center gap-8 border-dashed"
                    >
                        <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center">
                            <Search className="w-8 h-8 text-foreground/20" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-bold text-foreground">No projects found</h3>
                            <p className="text-sm text-foreground/40">Start by creating your first architectural reconstruction.</p>
                        </div>
                        <button onClick={() => router.push('/workspace')} className="btn-primary">
                            Get Started
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
