'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, CheckCircle2, User, Phone, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: {
        full_name: string;
        contact: string;
        bio: string;
        id: string;
    };
    onSuccess?: () => void;
}

export default function EditProfileModal({ 
    isOpen, onClose, initialData, onSuccess 
}: EditProfileModalProps) {
    const [fullName, setFullName] = useState(initialData.full_name);
    const [contact, setContact] = useState(initialData.contact);
    const [bio, setBio] = useState(initialData.bio);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    contact: contact,
                    bio: bio,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', initialData.id);

            if (updateError) throw updateError;

            setSaved(true);
            if (onSuccess) onSuccess();
            setTimeout(() => {
                onClose();
                setSaved(false);
            }, 2000);
        } catch (err: any) {
            console.error("Update failed:", err);
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
                        className="relative w-full max-w-lg glass rounded-[2.5rem] p-10 shadow-2xl border-white/20 dark:border-white/5"
                    >
                        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-foreground/5 transition-all">
                            <X className="w-5 h-5 text-foreground/40" />
                        </button>

                        <div className="flex flex-col gap-8">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold text-foreground tracking-tight">Edit Profile</h2>
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Update your professional identity</p>
                            </div>

                            {!saved ? (
                                <form onSubmit={handleUpdate} className="flex flex-col gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-indigo-500 transition-colors" />
                                            <input 
                                                type="text" 
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full bg-foreground/[0.03] border border-foreground/5 focus:border-indigo-500/50 outline-none rounded-2xl h-14 pl-12 pr-4 text-sm font-medium transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">Contact Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-indigo-500 transition-colors" />
                                            <input 
                                                type="text" 
                                                placeholder="+1 (555) 000-0000"
                                                value={contact}
                                                onChange={(e) => setContact(e.target.value)}
                                                className="w-full bg-foreground/[0.03] border border-foreground/5 focus:border-indigo-500/50 outline-none rounded-2xl h-14 pl-12 pr-4 text-sm font-medium transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">Bio / About</label>
                                        <div className="relative group">
                                            <BookOpen className="absolute left-4 top-4 w-4 h-4 text-foreground/20 group-focus-within:text-indigo-500 transition-colors" />
                                            <textarea 
                                                placeholder="Tell us about your architectural background..."
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                className="w-full bg-foreground/[0.03] border border-foreground/5 focus:border-indigo-500/50 outline-none rounded-2xl h-32 pl-12 pr-4 py-4 text-sm font-medium transition-all resize-none"
                                            />
                                        </div>
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
                                                Save Changes
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
                                    <p className="text-sm font-bold text-foreground uppercase tracking-widest">Profile Updated</p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
