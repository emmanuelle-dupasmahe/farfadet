// admin/pages/page.tsx
import React from 'react';
import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { FileText, Save, Trash2, PlusCircle, Pencil, X, Home, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminPagesManagement(props: {
    searchParams: Promise<{ edit?: string }>;
}) {
    const params = await props.searchParams;
    const editSlug = params?.edit;

    // 1. Récupérer toutes les pages dynamiques
    const [rows] = await pool.query('SELECT * FROM custom_pages ORDER BY created_at DESC') as any;

    // 2. Récupérer tous les événements disponibles pour le menu déroulant
    const [eventsRows] = await pool.query('SELECT id, title, activity_name FROM activity_events WHERE is_active = 1 ORDER BY event_date DESC') as any;

    // 3. Récupérer les textes de la page d'accueil depuis 'page_contents'
    const [homeRows] = await pool.query('SELECT * FROM page_contents WHERE page_slug = "accueil"') as any;
    const homeContent = homeRows.reduce((acc: any, row: any) => {
        acc[row.content_key] = row.content_value;
        return acc;
    }, {});

    // Trouver la page à éditer (soit l'accueil, soit une page dynamique)
    let pageToEdit = null;
    if (editSlug === 'accueil') {
        pageToEdit = {
            slug: 'accueil',
            title: homeContent.hero_title || "Viens défier ton mental !",
            subtitle: homeContent.hero_subtitle || "",
            content: "static_home", // Valeur fictive pour passer la validation
            practical_info: "",
            active_event_id: null
        };
    } else if (editSlug) {
        pageToEdit = rows.find((p: any) => p.slug === editSlug) || null;
    }

    // Filtrer les événements créés par Régis qui correspondent au slug en cours d'édition
    const filteredEvents = eventsRows.filter((e: any) => e.activity_name === pageToEdit?.slug);

    // 4. Action du serveur : Sauvegarder (Ajout / Modification)
    async function savePage(formData: FormData) {
        'use server';

        const isEdit = formData.get('is_edit') as string;
        const oldSlug = formData.get('old_slug') as string;
        const slug = (formData.get('slug') as string).toLowerCase().trim().replace(/[^a-z0-9-_]/g, '');
        const title = formData.get('title') as string;
        const subtitle = formData.get('subtitle') as string;
        const content = formData.get('content') as string;
        const practical_info = formData.get('practical_info') as string;

        // Récupération de l'ID de l'événement choisi
        const activeEventRaw = formData.get('active_event_id') as string;
        const active_event_id = activeEventRaw && activeEventRaw !== "" ? parseInt(activeEventRaw, 10) : null;

        if (!slug || !title || !content) return;

        // CAS SPÉCIAL : Mise à jour de la page d'accueil
        if (slug === 'accueil' || oldSlug === 'accueil') {
            await pool.query(
                'UPDATE page_contents SET content_value = ? WHERE page_slug = "accueil" AND content_key = "hero_title"',
                [title]
            );
            await pool.query(
                'UPDATE page_contents SET content_value = ? WHERE page_slug = "accueil" AND content_key = "hero_subtitle"',
                [subtitle]
            );

            revalidatePath('/');
            revalidatePath('/admin/pages');
            redirect('/admin/pages');
            return;
        }

        // CAS STANDARD : Pages dynamiques d'activités
        if (isEdit === 'true' && oldSlug) {
            await pool.query(
                'UPDATE custom_pages SET slug = ?, title = ?, subtitle = ?, content = ?, practical_info = ?, active_event_id = ? WHERE slug = ?',
                [slug, title, subtitle, content, practical_info || null, active_event_id, oldSlug]
            );

            await pool.query(
                'UPDATE photos SET category = ? WHERE category = ?',
                [slug, oldSlug]
            );
        } else {
            await pool.query(
                'INSERT INTO custom_pages (slug, title, subtitle, content, practical_info, active_event_id) VALUES (?, ?, ?, ?, ?, ?)',
                [slug, title, subtitle, content, practical_info || null, active_event_id]
            );
        }

        revalidatePath('/admin/pages');
        revalidatePath('/admin/photos');
        revalidatePath(`/[slug]`);
        if (oldSlug) revalidatePath(`/${oldSlug}`);
        revalidatePath(`/${slug}`);

        redirect('/admin/pages');
    }

    // 5. Action du serveur : Supprimer une page
    async function deletePage(formData: FormData) {
        'use server';

        const slug = formData.get('slug');
        if (!slug || slug === 'accueil') return; // Sécurité : impossible de supprimer l'accueil

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
                <h1 className="text-3xl font-bold text-slate-800">Gestion des Pages du Site</h1>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Formulaire (Ajout ou Édition) */}
                <div className={`p-6 rounded-2xl shadow-sm border h-fit xl:col-span-1 ${pageToEdit ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-xl font-bold flex items-center gap-2 ${pageToEdit ? 'text-amber-800' : 'text-slate-800'}`}>
                            {pageToEdit ? <Pencil size={20} /> : <PlusCircle size={20} />}
                            {pageToEdit ? (pageToEdit.slug === 'accueil' ? "Modifier l'Accueil" : 'Modifier la page') : 'Créer une page'}
                        </h2>
                        {pageToEdit && (
                            <a href="/admin/pages" className="text-amber-600 hover:bg-amber-200 p-1.5 rounded-lg">
                                <X size={18} />
                            </a>
                        )}
                    </div>

                    <form key={pageToEdit?.slug || 'new'} action={savePage} className="space-y-4">
                        <input type="hidden" name="is_edit" value={pageToEdit ? 'true' : 'false'} />
                        {pageToEdit && <input type="hidden" name="old_slug" value={pageToEdit.slug} />}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Identifiant URL (Slug)</label>
                            <input
                                type="text"
                                name="slug"
                                required
                                readOnly={pageToEdit?.slug === 'accueil'}
                                defaultValue={pageToEdit?.slug || ''}
                                placeholder="ex: srav"
                                className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 ${pageToEdit?.slug === 'accueil' ? 'bg-slate-100 text-slate-500 cursor-not-allowed font-mono' : 'bg-white'}`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {pageToEdit?.slug === 'accueil' ? "Grand titre fuchsia (Hero)" : "Titre de la page (H1)"}
                            </label>
                            <input type="text" name="title" required defaultValue={pageToEdit?.title || ''} placeholder="ex: Escalade Adaptée" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {pageToEdit?.slug === 'accueil' ? "Sous-titre d'introduction fuchsia" : "Sous-titre d'introduction"}
                            </label>
                            <input type="text" name="subtitle" defaultValue={pageToEdit?.subtitle || ''} placeholder="ex: Découverte en milieu vertical..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 focus:ring-2 focus:ring-blue-500" />
                        </div>

                        {/* Éléments masqués s'il s'agit de la page d'accueil générale */}
                        {pageToEdit?.slug !== 'accueil' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Texte de présentation principal</label>
                                    <textarea name="content" required rows={6} defaultValue={pageToEdit?.content || ''} placeholder="Décrivez l'activité en détail..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 resize-none focus:ring-2 focus:ring-blue-500" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Infos pratiques (Bloc de droite)</label>
                                    <textarea name="practical_info" rows={3} defaultValue={pageToEdit?.practical_info || ''} placeholder="Horaires, tarifs, matériel..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 resize-none focus:ring-2 focus:ring-blue-500" />
                                </div>

                                {/* MENU DÉROULANT DES ÉVÉNEMENTS LIÉS */}
                                <div className="pt-2 border-t border-slate-200/60">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                                        <Calendar size={16} className="text-blue-500" /> Événement exceptionnel rattaché
                                    </label>
                                    <select
                                        name="active_event_id"
                                        defaultValue={pageToEdit?.active_event_id || ''}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">-- Aucun formulaire d'inscription (Masqué) --</option>
                                        {filteredEvents.map((evt: any) => (
                                            <option key={evt.id} value={evt.id}>
                                                {evt.title}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-[11px] text-slate-400 mt-1 leading-tight font-medium">
                                        Affiche les événements correspondants à l'activité de cette page.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <input type="hidden" name="content" value="static_home" />
                        )}

                        <button type="submit" className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-lg text-sm text-white transition-colors mt-2 ${pageToEdit ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                            <Save size={18} /> {pageToEdit ? 'Mettre à jour' : 'Créer et publier'}
                        </button>
                    </form>
                </div>

                {/* Liste des pages publiées */}
                <div className="xl:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800">Pages du site internet</h2>

                    {/* BLOC FIXE POUR LA PAGE D'ACCUEIL */}
                    <div className="bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 p-5 flex items-center justify-between gap-4 shadow-sm">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <Home size={18} className="text-slate-600" />
                                <h3 className="font-bold text-slate-800 text-lg truncate">Page d'Accueil principale</h3>
                                <span className="text-xs text-slate-500 font-mono bg-slate-200 px-2 py-0.5 rounded-sm">
                                    / (Racine)
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm mt-1">Permet de modifier le grand titre d'en-tête fuchsia et son sous-titre associé.</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <a href="/admin/pages?edit=accueil" className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Modifier l'accueil">
                                <Pencil size={18} />
                            </a>
                        </div>
                    </div>

                    <hr className="border-slate-200 my-4" />

                    {/* BLOC DYNAMIQUE DES PAGES D'ACTIVITÉS */}
                    <h3 className="text-lg font-semibold text-slate-700">Pages d'activités personnalisées ({rows.length})</h3>

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
                                            {page.active_event_id && (
                                                <span className="text-[10px] font-bold uppercase tracking-wide bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full">
                                                    Formulaire Actif
                                                </span>
                                            )}
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