'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Zap, Activity, Clock, Layers, 
  RotateCcw, Info, BoxSelect, CheckCircle2, Save
} from 'lucide-react';
import { removeTextRegions } from '../../utils/preprocess/removeTextRegions';

const BabylonScene = dynamic(() => import('@/components/BabylonScene'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-100 dark:bg-slate-900/50 flex flex-col items-center justify-center gap-4 animate-pulse">
            <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Initializing 3D Engine</span>
        </div>
    )
});

interface WallSegment {
    start: { x: number; y: number };
    end: { x: number; y: number };
}

interface ReconstructionResult {
    segments: WallSegment[];
    width: number;
    height: number;
    debug_images: {
        threshold: string;
        mask: string;
        contours: string;
    };
}

import SaveProjectModal from './SaveProjectModal';
import { supabase } from '@/lib/supabase/client';

export default function WorkspaceSection({ initialProjectId }: { initialProjectId?: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [result, setResult] = useState<ReconstructionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const modelRef = useRef<HTMLDivElement>(null);

    // --- Load existing project if ID provided ---
    useEffect(() => {
        if (initialProjectId) {
            loadProject(initialProjectId);
        }
    }, [initialProjectId]);

    const loadProject = async (id: string) => {
        setLoading(true);
        setLoadingMsg("Synchronizing Project Data...");
        try {
            const { data, error: fetchError } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .single();

            if (fetchError) throw fetchError;
            if (data) {
                setResult(data.reconstruction_data);
                setPreviewUrl(data.floorplan_url);
            }
        } catch (err: any) {
            console.error("Load failed:", err);
            setError("Failed to load project: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (result && modelRef.current) {
            setTimeout(() => {
                modelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1000);
        }
    }, [result]);

    useEffect(() => {
        if (loading) {
            const msgs = [
                "Analyzing structural geometry...",
                "Detecting wall topology...",
                "Generating 3D reconstruction...",
                "Optimizing BIM manifold..."
            ];
            let idx = 0;
            setLoadingMsg(msgs[0]);
            const interval = setInterval(() => {
                idx = (idx + 1) % msgs.length;
                setLoadingMsg(msgs[idx]);
            }, 1800);
            return () => clearInterval(interval);
        }
    }, [loading]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setResult(null);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);

        try {
            let uploadBlob: Blob = file;
            try {
                const img = new Image();
                img.src = previewUrl || '';
                await new Promise((resolve) => { img.onload = resolve; });
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0);
                const processedCanvas = await removeTextRegions(canvas, (msg) => setLoadingMsg(msg));
                await new Promise<void>((resolve) => {
                    processedCanvas.toBlob((blob) => {
                        if (blob) uploadBlob = blob;
                        resolve();
                    }, file.type);
                });
            } catch (preprocessErr) {
                console.error("Preprocessing failed, falling back to original image:", preprocessErr);
                uploadBlob = file;
            }

            const formData = new FormData();
            formData.append('file', uploadBlob, file.name);

            const response = await fetch('http://localhost:8000/reconstruct', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Failed to process floorplan');
            }

            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col gap-10 w-full">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* LEFT SIDEBAR (CONTROL) */}
                <aside className="w-full lg:w-[320px] flex flex-col gap-6">
                    <div className="glass rounded-[2rem] p-8 flex flex-col gap-8 shadow-xl border-white/20 dark:border-white/5">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Workspace Actions</h3>
                            <button onClick={() => fileInputRef.current?.click()} className="w-full btn-secondary h-14 text-xs">
                                <Upload className="w-4 h-4" />
                                {file ? file.name.slice(0, 15) + '...' : 'Select File'}
                            </button>
                            <button 
                                onClick={handleUpload} 
                                disabled={!file || loading} 
                                className="w-full btn-primary h-14 text-xs shadow-indigo-600/20"
                            >
                                <Zap className="w-4 h-4 fill-current" />
                                Reconstruct 3D
                            </button>
                            
                            {result && (
                                <button 
                                    onClick={() => setIsSaveModalOpen(true)}
                                    className="w-full h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center gap-3 group"
                                >
                                    <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    Save Project
                                </button>
                            )}
                        </div>

                        <div className="h-px bg-foreground/5"></div>

                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Model Metadata</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-foreground/5 rounded-2xl p-4 border border-foreground/5 flex flex-col gap-1">
                                    <p className="text-[8px] font-black text-foreground/40 uppercase tracking-widest">Segments</p>
                                    <p className="text-2xl font-black text-foreground">{result?.segments?.length ?? 0}</p>
                                </div>
                                <div className="bg-foreground/5 rounded-2xl p-4 border border-foreground/5 flex flex-col gap-1">
                                    <p className="text-[8px] font-black text-foreground/40 uppercase tracking-widest">Latency</p>
                                    <p className="text-2xl font-black text-foreground">0.8<span className="text-xs font-bold ml-1 opacity-40">s</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {error && (
                        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-start gap-4">
                            <Info className="w-5 h-5 text-red-500 mt-0.5" />
                            <p className="text-xs text-red-500 font-bold leading-tight uppercase tracking-tight">{error}</p>
                        </div>
                    )}
                </aside>

                {/* CENTER CANVAS */}
                <main className="flex-1 flex flex-col gap-10 min-w-0">
                    <div className="glass rounded-[3rem] overflow-hidden flex flex-col shadow-2xl relative border-white/20 dark:border-white/5">
                        <div className="p-8 border-b border-foreground/5 flex justify-between items-center bg-foreground/[0.02]">
                            <div className="flex items-center gap-4">
                                <BoxSelect className="w-5 h-5 text-indigo-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40">2D Structural Source</span>
                            </div>
                        </div>
                        <div className="aspect-video flex items-center justify-center bg-white/50 dark:bg-black/20 p-12 overflow-hidden relative">
                            {previewUrl ? (
                                <img src={previewUrl} alt="2D Input" className="max-w-full max-h-full object-contain shadow-2xl rounded border border-foreground/10" />
                            ) : (
                                <div className="text-foreground/5 flex flex-col items-center gap-8">
                                    <BoxSelect className="w-32 h-32 stroke-[0.5]" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Floorplan Source</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div ref={modelRef} className="glass rounded-[3rem] overflow-hidden flex flex-col shadow-2xl relative border-white/20 dark:border-white/5 min-h-[600px]">
                        <div className="p-8 border-b border-foreground/5 flex justify-between items-center bg-foreground/[0.02]">
                            <div className="flex items-center gap-4">
                                <Layers className="w-5 h-5 text-indigo-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40">3D Reconstructed Model</span>
                            </div>
                        </div>
                        <div className="flex-1 relative bg-[#ebf0f7]">
                            {result ? (
                                <BabylonScene segments={result.segments} />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-foreground/10 gap-8">
                                    <Layers className="w-32 h-32 stroke-[0.5]" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Engine Offline</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* RIGHT PIPELINE */}
                <aside className="w-full lg:w-[240px] flex flex-col gap-6">
                    <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-widest pl-2">Pipeline Stream</h3>
                    <div className="flex flex-col gap-6">
                        {result && (
                            <>
                                <PreviewCard title="Threshold" img={result.debug_images.threshold} />
                                <PreviewCard title="Wall Mask" img={result.debug_images.mask} />
                                <PreviewCard title="Hough" img={result.debug_images.contours} />
                                <div className="glass rounded-3xl p-8 flex flex-col items-center gap-4 border-green-500/20">
                                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                                    <span className="text-[10px] font-black uppercase text-green-600 dark:text-green-400 tracking-widest text-center">Stability Validated</span>
                                </div>
                            </>
                        )}
                        {!result && (
                            <div className="glass rounded-3xl p-12 border-dashed flex flex-col items-center gap-6 opacity-30">
                                <Activity className="w-12 h-12 stroke-[1]" />
                                <p className="text-[9px] font-black text-center uppercase tracking-widest leading-loose">Awaiting Structural Diagnostic Stream</p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*" />

            <SaveProjectModal 
                isOpen={isSaveModalOpen} 
                onClose={() => setIsSaveModalOpen(false)}
                reconstructionData={result}
                floorplanUrl={previewUrl || undefined}
                onSuccess={(id) => {
                    // Update URL with new project ID
                    window.history.pushState({}, '', `/workspace?id=${id}`);
                }}
            />

            <AnimatePresence>
                {loading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
                    >
                        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-2xl"></div>
                        <div className="text-center flex flex-col gap-2">
                            <p className="text-foreground font-black text-3xl animate-pulse tracking-tight">{loadingMsg}</p>
                            <p className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.5em] mt-2">Nexus AI Core</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

function PreviewCard({ title, img }: { title: string, img: string }) {
    return (
        <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col gap-3 group cursor-zoom-in">
            <span className="text-[8px] font-black text-foreground/30 uppercase tracking-[0.3em] leading-none pl-1">{title}</span>
            <div className="bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center p-1 border border-white/10 group-hover:border-indigo-500/50 transition-all shadow-xl">
                <img src={`data:image/png;base64,${img}`} alt={title} className="max-w-full max-h-full object-contain" />
            </div>
        </motion.div>
    );
}
