import React from 'react';
import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { FileText, Save } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminPagesContentPage(props: {
    searchParams: Promise<{ p?: string }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = searchParams?.p || 'accueil';

    // 1. Récupérer tous les textes de la page sélectionnée
    const [rows] = await pool.query(
        'SELECT * FROM page_contents WHERE page_slug = ?',
        [currentPage]
    ) as any;

    // 2. Action du serveur pour mettre à jour les textes
    async function savePageContent(formData: FormData) {
        'use server';

        const pageSlug = formData.get('page_slug') as string;

        // Parcourir tous les champs du formulaire pour mettre à jour la BDD
        for (const [key, value] of formData.entries()) {
            if (key === 'page_slug') continue;

            await pool.query(
                'UPDATE page_contents SET content_value = ? WHERE page_slug = ? AND content_key = ?',
                [value as string, pageSlug, key]
            );
        }

        revalidatePath('/admin/pages');
        revalidatePath(pageSlug === 'accueil' ? '/' : `/${pageSlug}`);
    }

    // Liste des pages disponibles pour la navigation des onglets
    const availablePages = [
        { slug: 'accueil', label: '🏠 Page d’accueil' },
        { slug: 'escalade', label: '🧗‍♀️ Escalade' },
        { slug: 'secourisme', label: '⛑️ Secourisme' },
        { slug: 'kayak', label: '🛶 Kayak' }
    ];

    return (
        <div className="p-8 max-w-4xl mx-auto">

            <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                    <FileText size={28} />
                </div>
                <h1 className="text-3xl font-bold text-slate-800">Gestion des Textes</h1>
            </div>

            {/* Onglets de sélection de la page */}
            <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
                {availablePages.map((page) => (
                    <a
                        key={page.slug}
                        href={`/admin/pages?p=${page.slug}`}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${currentPage === page.slug
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                    >
                        {page.label}
                    </a>
                ))}
            </div>

            {/* Formulaire dynamique */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-6 uppercase tracking-wide text-sm text-slate-400">
                    Modification du contenu : {currentPage}
                </h2>

                {rows.length === 0 ? (
                    <p className="text-slate-500 italic text-sm">
                        Aucun champ de texte n'est encore configuré en base de données pour cette page.
                    </p>
                ) : (
                    <form action={savePageContent} className="space-y-6">
                        <input type="hidden" name="page_slug" value={currentPage} />

                        {rows.map((field: any) => (
                            <div key={field.id} className="block">
                                <label className="block text-sm font-bold text-slate-700 mb-1 capitalize">
                                    {field.content_key.replace(/_/g, ' ')}
                                </label>

                                {field.content_value.length > 100 ? (
                                    <textarea
                                        name={field.content_key}
                                        defaultValue={field.content_value}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        name={field.content_key}
                                        defaultValue={field.content_value}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
                                    />
                                )}
                            </div>
                        ))}

                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-colors"
                        >
                            <Save size={18} />
                            Enregistrer les textes
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}