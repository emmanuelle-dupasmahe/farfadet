import React from 'react';
import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { FileText, Save, Trash2, PlusCircle, Pencil, X } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminPagesManagement(props: {
    searchParams: Promise<{ edit?: string }>;
}) {
    const params = await props.searchParams;
    const editSlug = params?.edit;

    // 1. Récupérer toutes les pages dynamiques
    const [rows] = await pool.query('SELECT * FROM custom_pages ORDER BY created_at DESC') as any;

    // Trouver la page à éditer si le slug est présent dans l'URL (?edit=slug)
    const pageToEdit = editSlug ? rows.find((p: any) => p.slug === editSlug) : null;

    // 2. Action du serveur : Sauvegarder (Ajout / Modification)
    async function savePage(formData: FormData) {
        'use server';

        const isEdit = formData.get('is_edit') as string;
        const oldSlug = formData.get('old_slug') as string; // Récupère l'ancien slug pour cibler la bonne ligne
        const slug = (formData.get('slug') as string).toLowerCase().trim().replace(/[^a-z0-9-_]/g, '');
        const title = formData.get('title') as string;
        const subtitle = formData.get('subtitle') as string;
        const content = formData.get('content') as string;
        const practical_info = formData.get('practical_info') as string;

        if (!slug || !title || !content) return;

        if (isEdit === 'true' && oldSlug) {
            // Mode Modification : On met à jour la ligne en se basant sur l'ancien slug
            await pool.query(
                'UPDATE custom_pages SET slug = ?, title = ?, subtitle = ?, content = ?, practical_info = ? WHERE slug = ?',
                [slug, title, subtitle, content, practical_info || null, oldSlug]
            );

            // SÉCURITÉ : On met aussi à jour la catégorie des photos liées pour ne pas perdre le carrousel
            await pool.query(
                'UPDATE photos SET category = ? WHERE category = ?',
                [slug, oldSlug]
            );
        } else {
            // Mode Création
            await pool.query(
                'INSERT INTO custom_pages (slug, title, subtitle, content, practical_info) VALUES (?, ?, ?, ?, ?)',
                [slug, title, subtitle, content, practical_info || null]
            );
        }

        // Rafraîchir le cache
        revalidatePath('/admin/pages');
        revalidatePath('/admin/photos');
        revalidatePath(`/[slug]`);
        if (oldSlug) revalidatePath(`/${oldSlug}`);
        revalidatePath(`/${slug}`);

        // Nettoyer l'URL
        redirect('/admin/pages');
    }

    // 3. Action du serveur : Supprimer une page
    async function deletePage(formData: FormData) {
        'use server';

        const slug = formData.get('slug');
        if (!slug) return;

        await pool.query('DELETE FROM custom_pages WHERE slug = ?', [slug]);

        revalidatePath('/admin/pages');
        revalidatePath('/admin/photos');
        revalidatePath(`/[slug]`);
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">

            <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                    <FileText size={28} />
                </div>
                <h1 className="text-3xl font-bold text-slate-800">Gestion des Pages d'Activités</h1>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Formulaire (Ajout ou Édition) */}
                <div className={`p-6 rounded-2xl shadow-sm border h-fit xl:col-span-1 ${pageToEdit ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-xl font-bold flex items-center gap-2 ${pageToEdit ? 'text-amber-800' : 'text-slate-800'}`}>
                            {pageToEdit ? <Pencil size={20} /> : <PlusCircle size={20} />}
                            {pageToEdit ? 'Modifier la page' : 'Créer une page'}
                        </h2>
                        {pageToEdit && (
                            <a href="/admin/pages" className="text-amber-600 hover:bg-amber-200 p-1.5 rounded-lg">
                                <X size={18} />
                            </a>
                        )}
                    </div>

                    <form key={pageToEdit?.slug || 'new'} action={savePage} className="space-y-4">
                        <input type="hidden" name="is_edit" value={pageToEdit ? 'true' : 'false'} />
                        {/* Champ caché pour mémoriser l'ancien nom de l'URL pendant la modification */}
                        {pageToEdit && <input type="hidden" name="old_slug" value={pageToEdit.slug} />}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Identifiant URL (Slug)</label>
                            <input
                                type="text"
                                name="slug"
                                required
                                defaultValue={pageToEdit?.slug || ''}
                                placeholder="ex: srav (donnera l'adresse /srav)"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Titre de la page (H1)</label>
                            <input type="text" name="title" required defaultValue={pageToEdit?.title || ''} placeholder="ex: Escalade Adaptée" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Sous-titre d'introduction</label>
                            <input type="text" name="subtitle" defaultValue={pageToEdit?.subtitle || ''} placeholder="ex: Découverte en milieu vertical..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Texte de présentation principal</label>
                            <textarea name="content" required rows={7} defaultValue={pageToEdit?.content || ''} placeholder="Décrivez l'activité en détail..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 resize-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Infos pratiques (Bloc de droite)</label>
                            <textarea name="practical_info" rows={4} defaultValue={pageToEdit?.practical_info || ''} placeholder="Horaires, tarifs, matériel..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 resize-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <button type="submit" className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-lg text-sm text-white transition-colors ${pageToEdit ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                            <Save size={18} /> {pageToEdit ? 'Mettre à jour la page' : 'Créer et publier'}
                        </button>
                    </form>
                </div>

                {/* Liste des pages publiées */}
                <div className="xl:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800">Pages d'activités publiées ({rows.length})</h2>

                    {rows.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-slate-500">
                            Aucune page d'activité n'est présente.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {rows.map((page: any) => (
                                <div key={page.slug} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-bold text-slate-800 text-lg truncate">{page.title}</h3>
                                            <a href={`/${page.slug}`} target="_blank" className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded-sm hover:underline">
                                                /{page.slug}
                                            </a>
                                        </div>
                                        <p className="text-slate-500 text-sm mt-1 line-clamp-2">{page.content}</p>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                        <a href={`/admin/pages?edit=${page.slug}`} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Modifier">
                                            <Pencil size={18} />
                                        </a>
                                        <form action={deletePage} className="inline">
                                            <input type="hidden" name="slug" value={page.slug} />
                                            <button type="submit" className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                                                <Trash2 size={18} />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}