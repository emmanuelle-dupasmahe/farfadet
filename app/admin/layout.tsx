import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Image as ImageIcon, Megaphone, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-100 flex">
            {/* Barre latérale (Sidebar) */}
            <aside className="w-64 bg-blue-950 text-white flex flex-col">
                <div className="p-6 border-b border-blue-900">
                    <h2 className="text-xl font-bold text-pink-500">Espace Admin</h2>
                    <p className="text-sm text-slate-400 mt-1">Les Farfadets Vertigo</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-900 transition-colors">
                        <LayoutDashboard size={20} />
                        Tableau de bord
                    </Link>
                    <Link href="/admin/photos" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-900 transition-colors">
                        <ImageIcon size={20} />
                        Gestion des Photos
                    </Link>
                    <Link href="/admin/evenements" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-900 transition-colors">
                        <Megaphone size={20} />
                        Bandeau Événements
                    </Link>
                </nav>

                <div className="p-4 border-t border-blue-900">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors">
                        <LogOut size={20} />
                        Retour au site
                    </Link>
                </div>
            </aside>

            {/* Zone de contenu principal */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}