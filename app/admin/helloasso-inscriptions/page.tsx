// app/admin/helloasso-inscriptions/page.tsx
import React from 'react';
import pool from '@/lib/db';
import { Mail, Euro, Calendar, User } from 'lucide-react';

export default async function HelloAssoInscriptionsPage() {
    // On récupère les paiements HelloAsso triés par date d'inscription
    const [registrations]: any = await pool.query(
        'SELECT * FROM event_registrations ORDER BY registered_at DESC'
    );

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Inscriptions HelloAsso</h1>
                    <p className="text-slate-500 font-medium text-sm">
                        Suivi en temps réel des paiements et billets validés via HelloAsso ({registrations.length} enregistrements)
                    </p>
                </div>
            </div>

            {registrations.length === 0 ? (
                <div className="bg-slate-100 border border-slate-200 rounded-2xl p-8 text-center text-slate-500 font-medium">
                    Aucune notification de paiement HelloAsso reçue pour le moment.
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <th className="px-6 py-4">Événement / Formulaire</th>
                                <th className="px-6 py-4">Participant</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Montant payé</th>
                                <th className="px-6 py-4">Date de transaction</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {registrations.map((reg: any) => (
                                <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-pink-600">
                                        {reg.event_slug}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-900 capitalize">
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-slate-400" />
                                            {reg.first_name} {reg.last_name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                                            <Mail size={14} className="text-slate-400" /> {reg.email || 'Non renseigné'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {/* J'ai retiré le symbole € qui était en double à la fin */}
                                            <Euro size={12} /> {reg.amount_paid}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} className="text-slate-400" />
                                            {/* On utilise reg.registered_at au lieu de reg.created_at */}
                                            {reg.registered_at ? new Date(reg.registered_at).toLocaleDateString('fr-FR') : 'N/A'}
                                        </div>
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