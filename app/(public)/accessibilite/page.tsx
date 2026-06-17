import React from 'react';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AccessibilitePage() {
    let settings = null;
    try {
        const [rows] = await pool.query('SELECT * FROM site_settings WHERE id = 1') as any;
        if (rows.length > 0) settings = rows[0];
    } catch (error) {
        console.error("Erreur base de données accessibilité :", error);
    }

    const mainEmail = settings?.email || "Lesfarfadetsvertigo@gmail.com";

    return (
        <main className="max-w-4xl mx-auto px-4 py-16 text-slate-800">
            <h1 className="text-4xl font-extrabold text-blue-950 mb-8 border-b pb-4">Déclaration d'Accessibilité</h1>

            <section className="space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <p className="leading-relaxed text-slate-600">
                    L'association <strong>Les Farfadets Vertigo</strong> s'engage à rendre son site internet accessible conformément à l'article 47 de la loi n° 2005-102 du 11 février 2005.
                </p>

                <div>
                    <h2 className="text-xl font-bold text-pink-600 mb-2">1. État de conformité</h2>
                    <p className="leading-relaxed text-slate-600">
                        Le site internet <strong>asstsf.fr</strong> est <strong>partiellement conforme</strong> avec le référentiel général d’amélioration de l’accessibilité (RGAA), en raison des optimisations en cours d'intégration.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-pink-600 mb-2">2. Éléments optimisés pour l'accessibilité</h2>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600">
                        <li><strong>Contrôle des mouvements :</strong> Les carrousels d'images disposent d'un système de mise en pause automatique immédiate lors du survol de la souris afin de ne pas gêner la lecture ou l'utilisation de technologies d'assistance.</li>
                        <li><strong>Navigation au clavier :</strong> Les éléments interactifs principaux intègrent des états de focus visibles pour faciliter la navigation sans souris.</li>
                        <li><strong>Alternatives textuelles :</strong> Les visuels et photographies intègrent des descriptions textuelles obligatoires (`alt`) renseignées manuellement depuis l'espace d'administration.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-pink-600 mb-2">3. Retour d'information et contact</h2>
                    <p className="leading-relaxed text-slate-600">
                        Si vous rencontrez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou à une fonctionnalité du site, vous pouvez nous le signaler afin que nous puissions y remédier au plus vite en nous écrivant à : <strong>{mainEmail}</strong>.
                    </p>
                </div>
            </section>
        </main>
    );
}