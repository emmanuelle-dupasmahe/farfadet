import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Image as ImageIcon, Megaphone, Settings, LogOut, FileText, Layers, ShieldCheck, HelpCircle, CreditCard, Users } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
            
            <aside className="w-full md:w-64 bg-blue-950 text-white flex flex-col print:hidden shrink-0">
                <div className="p-4 md:p-6 border-b border-blue-900">
                    <h2 className="text-xl font-bold text-pink-500">Espace Admin</h2>
                    <p className="text-sm text-slate-400 mt-1">Les Farfadets Vertigo</p>
                </div>

                <nav className="flex flex-row md:flex-col flex-1 p-4 gap-2 md:gap-0 md:space-y-2 overflow-x-auto md:overflow-y-auto whitespace-nowrap md:whitespace-normal">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-900 transition-colors">
                        <LayoutDashboard size={20} className="shrink-0" />
                        Tableau de bord
                    </Link>

                    <Link href="/admin/photos" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-900 transition-colors">
                        <ImageIcon size={20} className="shrink-0" />
                        Médiathèque
                    </Link>

                    <Link href="/admin/evenements" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-900 transition-colors">
                        <Megaphone size={20} className="shrink-0" />
                        Bandeau Événements
                    </Link>

                    <Link href="/admin/inscriptions" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-900 transition-colors text-blue-300 font-medium">
                        <Users size={20} className="shrink-0" />
                        Inscriptions Site
                    </Link>

                    <Link href="/admin/helloasso-inscriptions" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-900 transition-colors text-emerald-400 font-medium">
                        <CreditCard size={20} className="shrink-0" />
                        Inscriptions HelloAsso
                    </Link>

                    <Link href="/admin/menu" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors mt-0 md:mt-2">
                        <FileText size={20} className="shrink-0" />
                        Menu du Header
                    </Link>

                    <Link href="/admin/configuration" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors">
                        <Settings size={20} className="shrink-0" />
                        Gestion du Footer
                    </Link>

                    <Link href="/admin/cards" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-900 transition-colors">
                        <Layers size={20} className="shrink-0" />
                        Cartes d'activités
                    </Link>

                    <Link href="/admin/pages" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors">
                        <FileText size={20} className="shrink-0" />
                        Textes des pages
                    </Link>

                    <Link href="/admin/equipe" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors md:mt-4 md:border-t md:border-blue-900 md:pt-4">
                        <ShieldCheck size={20} className="shrink-0" />
                        Gestion de l'Équipe
                    </Link>

                    <Link href="/admin/aide" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-pink-600/10 hover:bg-pink-600 border border-pink-500/20 text-pink-400 hover:text-white transition-colors">
                        <HelpCircle size={20} className="shrink-0" />
                        Guide d'Utilisation
                    </Link>
                </nav>

                <div className="p-4 border-t border-blue-900">
                    <form action={async () => {
                        'use server';
                        const { cookies } = await import('next/headers');
                        const cookieStore = await cookies();
                        cookieStore.delete('admin_session');
                        redirect('/login');
                    }}>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors"
                        >
                            <LogOut size={20} className="shrink-0" />
                            Déconnexion
                        </button>
                    </form>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}