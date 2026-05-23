'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import { motion } from 'framer-motion';
import { Save, User, Phone, BookOpen, Loader2, CheckCircle2 } from 'lucide-react';

export default function SettingsForm() {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setFullName(data.full_name || '');
                    setPhone(data.phone || '');
                    setBio(data.bio || '');
                }
            }
        } catch (err) {
            console.error("Failed to fetch profile:", err);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSaved(false);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: fullName,
                    phone: phone,
                    bio: bio,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error("Save failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="flex flex-col gap-10">
            <div className="glass rounded-[2.5rem] p-10 flex flex-col gap-8 border-white/20 dark:border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                type="tel" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-foreground/[0.03] border border-foreground/5 focus:border-indigo-500/50 outline-none rounded-2xl h-14 pl-12 pr-4 text-sm font-medium transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">Professional Bio</label>
                    <div className="relative group">
                        <BookOpen className="absolute left-4 top-6 w-4 h-4 text-foreground/20 group-focus-within:text-indigo-500 transition-colors" />
                        <textarea 
                            rows={4}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full bg-foreground/[0.03] border border-foreground/5 focus:border-indigo-500/50 outline-none rounded-2xl p-6 pl-12 text-sm font-medium transition-all resize-none"
                            placeholder="Brief description of your architectural background..."
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 items-center">
                <AnimatePresence>
                    {saved && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Changes Saved Successfully
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary h-14 px-10 shadow-indigo-600/20"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Save Preferences <Save className="w-4 h-4" /></>}
                </button>
            </div>
        </form>
    );
}
