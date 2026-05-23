'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, ShieldCheck, Loader2 } from 'lucide-react';

export default function ProfileDetails() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

                if (error) throw error;
                setProfile({ ...data, email: user.email });
            }
        } catch (err) {
            console.error("Failed to fetch profile:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="animate-pulse h-64 bg-foreground/5 rounded-[2.5rem]" />;

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10 items-center border-white/20 dark:border-white/5"
        >
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-4xl font-black text-white shadow-2xl">
                {profile?.full_name?.charAt(0) || <User className="w-12 h-12" />}
            </div>

            <div className="flex-1 flex flex-col gap-6 text-center md:text-left">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">{profile?.full_name || 'Anonymous User'}</h2>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-500 text-[10px] font-black uppercase tracking-widest">
                        <ShieldCheck className="w-3 h-3" />
                        Verified Professional
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-foreground/5 rounded-2xl p-4 flex items-center gap-4 border border-foreground/5">
                        <Mail className="w-4 h-4 text-foreground/30" />
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-foreground/30 uppercase tracking-widest">Email Address</span>
                            <span className="text-xs font-bold text-foreground">{profile?.email}</span>
                        </div>
                    </div>
                    <div className="bg-foreground/5 rounded-2xl p-4 flex items-center gap-4 border border-foreground/5">
                        <Calendar className="w-4 h-4 text-foreground/30" />
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-foreground/30 uppercase tracking-widest">Joined Since</span>
                            <span className="text-xs font-bold text-foreground">
                                {new Date(profile?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
