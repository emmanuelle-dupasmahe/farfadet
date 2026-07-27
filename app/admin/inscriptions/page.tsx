// app/admin/inscriptions/page.tsx
import React from 'react';
import pool from '@/lib/db';
import Link from 'next/link';
import { Users, ArrowRight } from 'lucide-react';

export default async function InscriptionsHomePage() {
    // On récupère tous les événements
    const [events]: any = await pool.query('SELECT * FROM activity_events ORDER BY created_at DESC');

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900">Inscriptions Site</h1>
                <p className="text-slate-500 font-medium text-sm mt-1">
                    Sélectionnez un événement pour voir la liste des participants.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.length === 0 ? (
                    <div className="col-span-full bg-slate-100 border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
                        Aucun événement n'est créé pour le moment.
                    </div>
                ) : (
                    events.map((event: any) => (
                        <Link 
                            href={`/admin/inscriptions/${event.id}`} 
                            key={event.id}
                            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all group flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 mb-2">{event.title}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2">{event.description}</p>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 font-medium">
                                <div className="flex items-center gap-2">
                                    <Users size={18} />
                                    <span className="text-sm">Voir les inscrits</span>
                                </div>
                                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}