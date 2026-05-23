'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, Edit3, 
  LayoutDashboard, Layers, Loader2, Info, BookOpen
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import EditProfileModal from '@/components/profile/EditProfileModal';
import { useRouter } from 'next/navigation';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                // If profile doesn't exist, create it (fallback)
                if (error.code === 'PGRST116') {
                    const { data: newProfile, error: insertError } = await supabase
                        .from('profiles')
                        .insert({
                            id: user.id,
                            full_name: user.user_metadata?.full_name || 'Architect',
                            email: user.email,
                        })
                        .select()
                        .single();
                    if (insertError) throw insertError;
                    setProfile(newProfile);
                } else {
                    throw error;
                }
            } else {
                setProfile(data);
            }
        } catch (err) {
            console.error("Profile fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em]">Synchronizing Profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            
            <main className="flex-1 pt-40 pb-20 px-8 md:px-20 max-w-7xl mx-auto w-full flex flex-col gap-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* LEFT COLUMN: AVATAR & QUICK ACTIONS */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-8"
                    >
                        <div className="glass rounded-[3rem] p-10 flex flex-col items-center text-center gap-6 border-white/20 dark:border-white/5 shadow-2xl">
                            <div className="w-32 h-32 rounded-full bg-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-600/30">
                                {profile?.full_name?.charAt(0) || 'A'}
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-foreground tracking-tight">{profile?.full_name}</h2>
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{profile?.role || 'Lead Architect'}</p>
                            </div>
                            <button 
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full btn-secondary h-12 text-[10px] px-6"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                Edit Profile
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button onClick={() => router.push('/dashboard')} className="w-full h-14 glass rounded-2xl flex items-center justify-between px-6 hover:bg-foreground/5 transition-all group">
                                <div className="flex items-center gap-4">
                                    <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                                    <ChevronRight className="w-3 h-3 group-hover:text-white" />
                                </div>
                            </button>
                            <button onClick={() => router.push('/workspace')} className="w-full h-14 glass rounded-2xl flex items-center justify-between px-6 hover:bg-foreground/5 transition-all group">
                                <div className="flex items-center gap-4">
                                    <Layers className="w-4 h-4 text-indigo-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Workspace</span>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                                    <ChevronRight className="w-3 h-3 group-hover:text-white" />
                                </div>
                            </button>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN: DETAILS */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 flex flex-col gap-8"
                    >
                        <div className="glass rounded-[3rem] p-12 flex flex-col gap-12 border-white/20 dark:border-white/5 shadow-2xl">
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-widest flex items-center gap-3">
                                    <Info className="w-3 h-3" />
                                    Account Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <DetailItem icon={<Mail />} label="Email Address" value={profile?.email} readOnly />
                                    <DetailItem icon={<Phone />} label="Contact Number" value={profile?.contact || 'Not Provided'} />
                                    <DetailItem icon={<Calendar />} label="Member Since" value={new Date(profile?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} readOnly />
                                </div>
                            </div>

                            <div className="h-px bg-foreground/5"></div>

                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-widest flex items-center gap-3">
                                    <BookOpen className="w-3 h-3" />
                                    Professional Bio
                                </h3>
                                <p className="text-sm text-foreground/60 leading-relaxed font-medium">
                                    {profile?.bio || 'No bio provided yet. Tell us about your architectural journey and specializations.'}
                                </p>
                            </div>
                        </div>

                        {/* STATS SECTION */}
                        <div className="grid grid-cols-3 gap-6">
                            <StatCard label="Saved Projects" value="12" />
                            <StatCard label="3D Renderings" value="48" />
                            <StatCard label="Account Level" value="PRO" highlight />
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />

            {profile && (
                <EditProfileModal 
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    initialData={{
                        id: profile.id,
                        full_name: profile.full_name,
                        contact: profile.contact || '',
                        bio: profile.bio || '',
                    }}
                    onSuccess={fetchProfile}
                />
            )}
        </div>
    );
}

function DetailItem({ icon, label, value, readOnly }: any) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.2em]">{label}</label>
            <div className="flex items-center gap-3">
                <div className="text-indigo-500 opacity-50">{icon && React.cloneElement(icon, { className: 'w-4 h-4' })}</div>
                <span className={`text-sm font-bold text-foreground ${readOnly ? 'opacity-40' : ''}`}>{value}</span>
            </div>
        </div>
    );
}

function StatCard({ label, value, highlight }: any) {
    return (
        <div className={`glass rounded-[2rem] p-6 flex flex-col gap-1 items-center justify-center border-white/20 dark:border-white/5 transition-all hover:scale-105 cursor-default ${highlight ? 'bg-indigo-600 text-white border-none shadow-xl shadow-indigo-600/20' : ''}`}>
            <span className={`text-[8px] font-black uppercase tracking-widest ${highlight ? 'text-white/60' : 'text-foreground/30'}`}>{label}</span>
            <span className="text-2xl font-black">{value}</span>
        </div>
    );
}

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
