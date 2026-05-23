'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface SaveProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    reconstructionData: any;
    floorplanUrl?: string;
    onSuccess?: (id: string) => void;
}

export default function SaveProjectModal({ 
    isOpen, onClose, reconstructionData, floorplanUrl, onSuccess 
}: SaveProjectModalProps) {
    const [projectName, setProjectName] = useState('');
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectName) return;

        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("You must be logged in to save projects");

            const { data, error: saveError } = await supabase
                .from('projects')
                .insert({
                    user_id: user.id,
                    project_name: projectName,
                    floorplan_url: floorplanUrl,
                    reconstruction_data: reconstructionData,
                })
                .select()
                .single();

            if (saveError) throw saveError;

            setSaved(true);
            if (onSuccess) onSuccess(data.id);
            setTimeout(() => {
                onClose();
                setSaved(false);
                setProjectName('');
            }, 2000);
        } catch (err: any) {
            console.error("Save failed:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md glass rounded-[2.5rem] p-10 shadow-2xl border-white/20 dark:border-white/5"
                    >
                        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-foreground/5 transition-all">
                            <X className="w-5 h-5 text-foreground/40" />
                        </button>

                        <div className="flex flex-col gap-8">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold text-foreground tracking-tight">Save Project</h2>
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Secure your architectural data</p>
                            </div>

                            {!saved ? (
                                <form onSubmit={handleSave} className="flex flex-col gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">Project Name</label>
                                        <input 
                                            autoFocus
                                            type="text" 
                                            required
                                            placeholder="e.g. Modern Villa - Phase 1"
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                            className="w-full bg-foreground/[0.03] border border-foreground/5 focus:border-indigo-500/50 outline-none rounded-2xl h-14 px-6 text-sm font-medium transition-all"
                                        />
                                    </div>

                                    {error && (
                                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center">{error}</p>
                                    )}

                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="btn-primary w-full h-14 shadow-indigo-600/20"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Save Project
                                                <Save className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center gap-6 py-10"
                                >
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                    </div>
                                    <p className="text-sm font-bold text-foreground uppercase tracking-widest">Project Saved Successfully</p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
