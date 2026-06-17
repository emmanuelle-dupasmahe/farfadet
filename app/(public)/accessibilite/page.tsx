import React from 'react';
import pool from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AccessibilitePage() {
    let settings = null;
    try {
        const [rows] = await pool.query('SELECT * FROM site_settings WHERE id = 1') as any;
        if (rows.length > 0) settings = rows[0];
    } catch (error) {
        console.error("Erreur base de données accessibilité :", error);
    }

    return (
        <main className="max-w-4xl mx-auto px-4 py-16 text-slate-800">
            {/* Bouton Retour Accueil */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-pink-600 font-medium mb-4 transition-colors group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Retour à l'accueil
            </Link>

            <h1 className="text-4xl font-extrabold text-blue-950 mb-8 border-b pb-4">Déclaration d'Accessibilité</h1>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                {settings?.declaration_accessibilite ? (
                    <p className="whitespace-pre-wrap text-slate-600 leading-relaxed">
                        {settings.declaration_accessibilite}
                    </p>
                ) : (
                    <p className="text-slate-400 italic">
                        La déclaration d'accessibilité est en cours de rédaction.
                    </p>
                )}
            </div>
        </main>
    );
}