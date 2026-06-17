import React from 'react';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function MentionsLegalesPage() {
    let settings = null;
    try {
        const [rows] = await pool.query('SELECT * FROM site_settings WHERE id = 1') as any;
        if (rows.length > 0) settings = rows[0];
    } catch (error) {
        console.error("Erreur base de données mentions légales :", error);
    }

    return (
        <main className="max-w-4xl mx-auto px-4 py-16 text-slate-800">
            <h1 className="text-4xl font-extrabold text-blue-950 mb-8 border-b pb-4">Mentions Légales</h1>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                {settings?.mentions_legales ? (
                    <p className="whitespace-pre-wrap text-slate-600 leading-relaxed">
                        {settings.mentions_legales}
                    </p>
                ) : (
                    <p className="text-slate-400 italic">
                        Le contenu des mentions légales est en cours de rédaction.
                    </p>
                )}
            </div>
        </main>
    );
}