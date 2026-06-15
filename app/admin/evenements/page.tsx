import React from 'react';
import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Megaphone, Save, Trash2, PlusCircle, Calendar, Pencil, X } from 'lucide-react';
import Link from 'next/link';

// 1. On force Next.js à ne jamais mettre cette page d'administration en cache
export const dynamic = 'force-dynamic';

export default async function AdminEventsPage(props: {
    searchParams: Promise<{ edit?: string }>;
}) {
    // 2. On "attend" la lecture de l'URL (La nouveauté qui débloque tout)
    const params = await props.searchParams;
    const editId = params?.edit;

    // 3. Récupérer TOUS les événements
    const [rows] = await pool.query('SELECT * FROM events ORDER BY id DESC') as any;

    // 4. Vérifier si on est en mode édition
    const eventToEdit = editId ? rows.find((e: any) => e.id.toString() === editId) : null;

    // 5. Action du serveur pour sauvegarder (Gère l'Ajout ET la Modification)
    async function saveEvent(formData: FormData) {
        'use server';

        const id = formData.get('id') as string; // L'ID caché (seulement présent en édition)
        const dateText = formData.get('date_text') as string;
        const mainText = formData.get('main_text') as string;
        const linkText = formData.get('link_text') as string;
        const linkUrl = formData.get('link_url') as string;

        if (!mainText) return;

        if (id) {
            // S'il y a un ID, c'est une MODIFICATION (UPDATE)
            await pool.query(
                'UPDATE events SET date_text = ?, main_text = ?, link_text = ?, link_url = ? WHERE id = ?',
                [dateText || null, mainText, linkText || null, linkUrl || null, id]
            );
        } else {
            // Sinon, c'est un AJOUT (INSERT)
            await pool.query(
                'INSERT INTO events (date_text, main_text, link_text, link_url) VALUES (?, ?, ?, ?)',
                [dateText || null, mainText, linkText || null, linkUrl || null]
            );
        }

        revalidatePath('/admin/evenements');
        revalidatePath('/'); // Met à jour l'accueil
    }

    // 6. Action du serveur pour supprimer un événement
    async function deleteEvent(formData: FormData) {
        'use server';

        const id = formData.get('id');
        if (!id) return;

        await pool.query('DELETE FROM events WHERE id = ?', [id]);

        revalidatePath('/admin/evenements');
        revalidatePath('/'); // Met à jour l'accueil
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">

            <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                    <Megaphone size={28} />
                </div>
                <h1 className="text-3xl font-bold text-slate-800">Gestion du Bandeau d'Actualité</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Colonne de gauche : Formulaire d'ajout ou de modification */}
                <div className={`p-6 rounded-2xl shadow-sm border h-fit transition-colors ${eventToEdit ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-xl font-bold flex items-center gap-2 ${eventToEdit ? 'text-amber-800' : 'text-slate-800'}`}>
                            {eventToEdit ? <Pencil size={20} className="text-amber-600" /> : <PlusCircle size={20} className="text-blue-600" />}
                            {eventToEdit ? 'Modifier le message' : 'Ajouter un message'}
                        </h2>

                        {/* Bouton pour annuler l'édition (retour à l'URL normale) */}
                        {eventToEdit && (
                            <Link href="/admin/evenements" className="text-amber-600 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 p-1.5 rounded-lg transition-colors">
                                <X size={18} />
                            </Link>
                        )}
                    </div>

                    <form key={eventToEdit?.id || 'new'} action={saveEvent} className="space-y-4">
                        {/* Champ caché pour envoyer l'ID si on est en mode édition */}
                        {eventToEdit && <input type="hidden" name="id" value={eventToEdit.id} />}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Date ou Mention
                            </label>
                            <input
                                type="text"
                                name="date_text"
                                defaultValue={eventToEdit?.date_text || ''}
                                placeholder="ex: URGENT, NOVEMBRE 2026"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Message principal <span className="text-pink-500">*</span>
                            </label>
                            <textarea
                                name="main_text"
                                required
                                defaultValue={eventToEdit?.main_text || ''}
                                rows={3}
                                placeholder="ex: Inscriptions ouvertes pour le stage de Toussaint"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none bg-white"
                            />
                        </div>

                        <div className="p-4 bg-white/60 rounded-lg border border-slate-200/60 space-y-3">
                            <h3 className="text-xs font-bold text-slate-700">Bouton d'action (Optionnel)</h3>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Texte du bouton</label>
                                <input
                                    type="text"
                                    name="link_text"
                                    defaultValue={eventToEdit?.link_text || ''}
                                    placeholder="ex: S'inscrire"
                                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Lien (URL)</label>
                                <input
                                    type="text"
                                    name="link_url"
                                    defaultValue={eventToEdit?.link_url || ''}
                                    placeholder="https://..."
                                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-lg transition-colors text-sm text-white ${eventToEdit ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            <Save size={18} />
                            {eventToEdit ? 'Enregistrer les modifications' : 'Publier le message'}
                        </button>
                    </form>
                </div>

                {/* Colonne de droite : Liste des événements en ligne */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800">Messages actuellement en ligne</h2>
                        <span className="bg-slate-100 text-slate-600 py-1 px-3 rounded-full text-sm font-semibold">
                            {rows.length} au total (seuls les 3 plus récents défilent)
                        </span>
                    </div>

                    {rows.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-slate-500">
                            Aucun événement n'est configuré. Le bandeau n'apparaîtra pas sur le site.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {rows.map((event: any, index: number) => (
                                <div
                                    key={event.id}
                                    className={`bg-white rounded-xl border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${index < 3 ? 'border-blue-200 shadow-sm' : 'border-slate-200 opacity-60'}`}
                                >
                                    <div className="flex-1">
                                        {index < 3 ? (
                                            <span className="inline-block bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-2">En ligne (Position {index + 1})</span>
                                        ) : (
                                            <span className="inline-block bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-2">Archivé (Invisible)</span>
                                        )}

                                        <div className="flex items-center gap-2 text-pink-600 font-semibold text-xs mb-1">
                                            {event.date_text && <><Calendar size={14} /> {event.date_text}</>}
                                        </div>
                                        <p className="font-bold text-slate-800 text-sm">{event.main_text}</p>

                                        {event.link_url && event.link_text && (
                                            <a href={event.link_url} className="text-blue-600 text-xs hover:underline mt-1 inline-block">
                                                Bouton : {event.link_text} &rarr;
                                            </a>
                                        )}
                                    </div>

                                    <div className="shrink-0 flex items-center gap-2">
                                        {/* Bouton Modifier (Lien vers l'URL avec ?edit=ID) */}
                                        <Link
                                            href={`/admin/evenements?edit=${event.id}`}
                                            className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 p-2 border border-transparent hover:border-amber-100 rounded-lg transition-colors"
                                            title="Modifier cet événement"
                                        >
                                            <Pencil size={18} />
                                        </Link>

                                        {/* Bouton Supprimer */}
                                        <form action={deleteEvent}>
                                            <input type="hidden" name="id" value={event.id} />
                                            <button
                                                type="submit"
                                                className="text-red-400 hover:text-white hover:bg-red-500 p-2 border border-transparent hover:border-red-500 rounded-lg transition-colors"
                                                title="Supprimer cet événement"
                                            >
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