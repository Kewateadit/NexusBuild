'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, Plus, Loader2, ChevronRight, Layout
} from 'lucide-react';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const WorkspaceSection = dynamic(() => import('@/components/workspace/WorkspaceSection'), { ssr: false });

export default function WorkspacePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const projectId = searchParams.get('id');
    const [savedProjects, setSavedProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedProjects();
    }, []);

    const fetchSavedProjects = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { data, error } = await supabase
                .from('projects')
                .select('id, project_name, created_at')
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;
            setSavedProjects(data || []);
        } catch (err) {
            console.error("Failed to fetch sidebar projects:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            
            <div className="flex-1 pt-32 pb-20 px-8 flex gap-8 max-w-[1920px] mx-auto w-full">
                {/* SAVED PROJECTS SIDEBAR */}
                <aside className="hidden xl:flex w-[280px] flex-col gap-6 sticky top-32 h-[calc(100vh-160px)]">
                    <div className="glass rounded-[2rem] p-6 flex flex-col gap-6 border-white/20 dark:border-white/5 overflow-hidden">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <History className="w-4 h-4 text-indigo-500" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/40">History</h3>
                            </div>
                            <button onClick={() => router.push('/workspace')} className="p-1.5 rounded-lg hover:bg-foreground/5 transition-all text-indigo-500">
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                            {loading ? (
                                <div className="flex flex-col gap-4 p-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-12 bg-foreground/5 rounded-xl animate-pulse"></div>
                                    ))}
                                </div>
                            ) : savedProjects.length > 0 ? (
                                savedProjects.map((p) => (
                                    <button 
                                        key={p.id}
                                        onClick={() => router.push(`/workspace?id=${p.id}`)}
                                        className={`w-full group p-3 rounded-xl transition-all flex items-center justify-between text-left border ${
                                            projectId === p.id 
                                            ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400' 
                                            : 'border-transparent hover:bg-foreground/5 text-foreground/60 hover:text-foreground'
                                        }`}
                                    >
                                        <div className="flex flex-col gap-0.5 min-w-0">
                                            <span className="text-xs font-bold truncate">{p.project_name}</span>
                                            <span className="text-[8px] font-medium opacity-40 uppercase tracking-wider">
                                                {new Date(p.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all ${projectId === p.id ? 'opacity-100' : ''}`} />
                                    </button>
                                ))
                            ) : (
                                <div className="p-8 text-center flex flex-col items-center gap-4 opacity-20">
                                    <Layout className="w-8 h-8 stroke-[1]" />
                                    <p className="text-[9px] font-black uppercase tracking-widest">No Recent Projects</p>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* MAIN WORKSPACE */}
                <div className="flex-1 min-w-0">
                    <WorkspaceSection initialProjectId={projectId || undefined} />
                </div>
            </div>

            <Footer />
        </div>
    );
}
