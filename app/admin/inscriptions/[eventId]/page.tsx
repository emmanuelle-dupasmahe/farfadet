// app/admin/inscriptions/[eventId]/page.tsx
import React from 'react';
import pool from '@/lib/db';
import { Phone, Mail } from 'lucide-react';
import PrintButton from '@/components/PrintButton'; // 1. On importe le nouveau bouton Client

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ eventId: string }>;
}

export default async function EventRegistrationsAdminPage({ params }: Props) {
    const { eventId } = await params;

    // Récupérer les infos de l'événement
    const [eventRows] = await pool.query('SELECT title FROM activity_events WHERE id = ?', [eventId]) as any;
    const event = eventRows[0];

    // Récupérer la liste des inscrits
    const [registrations] = await pool.query(
        'SELECT * FROM activity_registrations WHERE event_id = ? ORDER BY registered_at DESC',
        [eventId]
    ) as any;

    if (!event) {
        return <div className="p-8 text-center font-medium">Événement introuvable.</div>;
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">{event.title}</h1>
                    <p className="text-slate-500 font-medium text-sm">
                        Liste des participants inscrits en direct sur le site ({registrations.length} personnes)
                    </p>
                </div>

                {/* 2. On utilise le composant client isolé ici */}
                <PrintButton />
            </div>

            {registrations.length === 0 ? (
                <div className="bg-slate-100 border border-slate-200 rounded-2xl p-8 text-center text-slate-500 font-medium">
                    Aucun inscrit pour le moment sur cet événement.
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <th className="px-6 py-4">Participant</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Tranche d'âge</th>
                                <th className="px-6 py-4">Date d'inscription</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {registrations.map((reg: any) => (
                                <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-slate-900 capitalize">
                                        {reg.first_name} {reg.last_name}
                                    </td>
                                    <td className="px-6 py-4 space-y-1">
                                        <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                                            <Mail size={14} className="text-slate-400" /> {reg.email}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                                            <Phone size={14} className="text-slate-400" /> {reg.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${reg.age_group === 'enfant' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                                            }`}>
                                            {reg.age_group}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                                        {new Date(reg.registered_at).toLocaleDateString('fr-FR')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}