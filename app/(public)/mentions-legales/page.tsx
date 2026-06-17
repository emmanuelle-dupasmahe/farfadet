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

    const mainPhone = settings?.phone || "06 20 78 49 14";
    const mainEmail = settings?.email || "Lesfarfadetsvertigo@gmail.com";

    return (
        <main className="max-w-4xl mx-auto px-4 py-16 text-slate-800">
            <h1 className="text-4xl font-extrabold text-blue-950 mb-8 border-b pb-4">Mentions Légales</h1>

            <section className="space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-pink-600 mb-2">1. Éditeur du site</h2>
                    <p className="leading-relaxed text-slate-600">
                        Le site internet <strong>asstsf.fr</strong> est édité par l'association
                        <strong> Les Farfadets Vertigo (ASSTSF)</strong>, association à but non lucratif régie par la loi du 1er juillet 1901.<br />
                        <strong>Contact téléphonique :</strong> {mainPhone}<br />
                        <strong>Adresse email :</strong> {mainEmail}
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-pink-600 mb-2">2. Responsable de la publication</h2>
                    <p className="text-slate-600">Le responsable de la publication du site est le bureau de l'association Les Farfadets Vertigo.</p>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-pink-600 mb-2">3. Hébergement du site</h2>
                    <p className="leading-relaxed text-slate-600">
                        Ce site internet est hébergé gracieusement sur les infrastructures techniques personnelles de :<br />
                        <strong>Pascal Fortunati</strong>, membre collaborateur technique de l'association.<br />
                        L'hébergeur s'efforce d'assurer la disponibilité et la sécurité du site au mieux de ses capacités techniques.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-pink-600 mb-2">4. Propriété intellectuelle</h2>
                    <p className="leading-relaxed text-slate-600">
                        Tous les contenus présents sur ce site (textes, photographies, illustrations, logos) sont la propriété exclusive de l'association Les Farfadets Vertigo, sauf mention contraire (notamment les logos des fédérations partenaires UFOLEP et FFSA). Toute reproduction ou représentation totale ou partielle de ce site est interdite sans autorisation expresse.
                    </p>
                </div>
            </section>
        </main>
    );
}