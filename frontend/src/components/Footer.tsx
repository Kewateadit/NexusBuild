'use client';

import React from 'react';
import { Mail, Linkedin, GithubIcon, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="py-32 px-10 bg-white dark:bg-slate-950 border-t border-foreground/5 flex flex-col gap-20">
            <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start gap-16">
                <div className="flex flex-col gap-8 max-w-sm">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-black text-sm italic">NB</span>
                        </div>
                        <span className="text-foreground font-black text-xl tracking-tighter">NexusBuild</span>
                    </Link>
                    <p className="text-base text-foreground/40 font-medium leading-relaxed">
                        The professional AI architectural intelligence platform for structural reconstruction and BIM-ready geometry generation.
                    </p>
                    <div className="flex gap-5">
                        <SocialLink icon={<Mail className="w-4 h-4" />} href="mailto:contact@nexusbuild.ai" />
                        <SocialLink icon={<Linkedin className="w-4 h-4" />} href="#" />
                        <SocialLink icon={<GithubIcon className="w-4 h-4" />} href="#" />
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-20">
                    <FooterGroup title="Product" links={[
                        { label: 'Reconstruction', href: '/' },
                        { label: 'Pipeline', href: '/architecture' },
                        { label: 'Features', href: '#' },
                        { label: 'Roadmap', href: '/about' }
                    ]} />
                    <FooterGroup title="Platform" links={[
                        { label: 'Docs', href: '#' },
                        { label: 'API Reference', href: '#' },
                        { label: 'Architecture', href: '/architecture' },
                        { label: 'Status', href: '#' }
                    ]} />
                    <FooterGroup title="Contact" links={[
                        { label: 'Support', href: 'mailto:support@nexusbuild.ai' },
                        { label: 'Enterprise', href: '#' },
                        { label: 'Contact Us', href: '#' }
                    ]} />
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-10 border-t border-foreground/5 pt-12">
                <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em]">© 2024 NexusBuild Structural Engine. All rights reserved.</p>
                <div className="flex gap-10">
                     <Link href="#" className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] hover:text-indigo-500 transition-colors">Privacy Policy</Link>
                     <Link href="#" className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] hover:text-indigo-500 transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ icon, href }: { icon: any, href: string }) {
    return (
        <a 
            href={href} 
            className="w-10 h-10 rounded-xl bg-foreground/5 border border-foreground/5 flex items-center justify-center text-foreground/40 hover:text-indigo-600 hover:bg-indigo-600/10 hover:border-indigo-600/20 transition-all"
        >
            {icon}
        </a>
    );
}

function FooterGroup({ title, links }: { title: string, links: { label: string, href: string }[] }) {
    return (
        <div className="flex flex-col gap-6">
            <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.3em]">{title}</h4>
            <div className="flex flex-col gap-4">
                {links.map(link => (
                    <Link 
                        key={link.label} 
                        href={link.href} 
                        className="text-xs font-bold text-foreground/40 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
