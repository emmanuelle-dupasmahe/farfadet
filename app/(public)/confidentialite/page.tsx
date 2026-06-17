import React from 'react';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ConfidentialitePage() {
    let settings = null;
    try {
        const [rows] = await pool.query('SELECT * FROM site_settings WHERE id = 1') as any;
        if (rows.length > 0) settings = rows[0];
    } catch (error) {
        console.error("Erreur base de données confidentialité :", error);
    }

    const mainEmail = settings?.email || "Lesfarfadetsvertigo@gmail.com";

    return (
        <main className="max-w-4xl mx-auto px-4 py-16 text-slate-800">
            <h1 className="text-4xl font-extrabold text-blue-950 mb-8 border-b pb-4">Politique de Confidentialité</h1>

            <section className="space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-slate-600 italic">Dernière mise à jour : Juin 2026</p>

                <div>
                    <h2 className="text-xl font-bold text-pink-600 mb-2">1. Collecte des données personnelles</h2>
                    <p className="leading-relaxed text-slate-600">
                        L'association Les Farfadets Vertigo s'engage à ce que la collecte et le traitement de vos données soient conformes au Règlement Général sur la Protection des Données (RGPD).<br />
                        <strong>Visiteurs publics :</strong> Ce site vitrine ne collecte aucune donnée personnelle automatisée, ne possède aucun système de traceurs (cookies tiers) à visée publicitaire ou commerciale.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-pink-600 mb-2">2. Comptes Administrateurs</h2>
                    <p className="leading-relaxed text-slate-600">
                        Pour les membres de l'équipe disposant d'un accès d'administration au site, nous stockons uniquement l'adresse email et une version sécurisée (hachée de manière irréversible) du mot de passe. Un cookie de session technique (`admin_session`) est utilisé temporairement pour maintenir la connexion sécurisée au tableau de bord.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-pink-600 mb-2">3. Liens vers des tiers (HelloAsso)</h2>
                    <p className="leading-relaxed text-slate-600">
                        Notre site propose des liens vers la plateforme externe <strong>HelloAsso</strong> pour la gestion des inscriptions et des paiements. Lorsque vous quittez notre site pour effectuer une transaction sur HelloAsso, leurs propres politiques de confidentialité et de traitement des données s'appliquent.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-pink-600 mb-2">4. Vos Droits</h2>
                    <p className="leading-relaxed text-slate-600">
                        Conformément à la réglementation, vous disposez d'un droit d'accès, de rectification ou de suppression des données vous concernant. Pour toute demande, vous pouvez nous écrire directement à : <strong>{mainEmail}</strong>.
                    </p>
                </div>
            </section>
        </main>
    );
}