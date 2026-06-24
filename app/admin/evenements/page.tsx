import React from 'react';
import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Megaphone, Save, Trash2, PlusCircle, Calendar, Pencil, X, Users } from 'lucide-react';
import Link from 'next/link';

// 1. On force Next.js à ne jamais mettre cette page d'administration en cache
export const dynamic = 'force-dynamic';

export default async function AdminEventsPage(props: {
    searchParams: Promise<{ edit?: string }>;
}) {
    // 2. On "attend" la lecture de l'URL pour le mode édition du bandeau d'actualité
    const params = await props.searchParams;
    const editId = params?.edit;

    // 3. Récupérer TOUS les messages du bandeau d'actualité
    const [rows] = await pool.query('SELECT * FROM events ORDER BY id DESC') as any;

    // 4. Récupérer TOUS les événements/stages d'activités spécifiques de Régis
    const [activityEvents] = await pool.query('SELECT * FROM activity_events ORDER BY event_date DESC') as any;

    // 5. Vérifier si on est en mode édition sur le bandeau d'actualité
    const eventToEdit = editId ? rows.find((e: any) => e.id.toString() === editId) : null;

    // ==========================================
    // ACTIONS SERVEUR : PARTIE BANDEAU D'ACTUALITÉ
    // ==========================================
    async function saveEvent(formData: FormData) {
        'use server';

        const id = formData.get('id') as string;
        const dateText = formData.get('date_text') as string;
        const mainText = formData.get('main_text') as string;
        const linkText = formData.get('link_text') as string;
        const linkUrl = formData.get('link_url') as string;

        if (!mainText) return;

        if (id) {
            await pool.query(
                'UPDATE events SET date_text = ?, main_text = ?, link_text = ?, link_url = ? WHERE id = ?',
                [dateText || null, mainText, linkText || null, linkUrl || null, id]
            );
        } else {
            await pool.query(
                'INSERT INTO events (date_text, main_text, link_text, link_url) VALUES (?, ?, ?, ?)',
                [dateText || null, mainText, linkText || null, linkUrl || null]
            );
        }

        revalidatePath('/admin/evenements');
        revalidatePath('/');
    }

    async function deleteEvent(formData: FormData) {
        'use server';

        const id = formData.get('id');
        if (!id) return;

        await pool.query('DELETE FROM events WHERE id = ?', [id]);

        revalidatePath('/admin/evenements');
        revalidatePath('/');
    }

    // ==========================================
    // ACTIONS SERVEUR : PARTIE STAGES / JOURNÉES D'ACTIVITÉS
    // ==========================================
    async function createActivityEvent(formData: FormData) {
        'use server';
        const activity_name = formData.get('activity_name') as string;
        const title = formData.get('title') as string;
        const event_date = formData.get('event_date') as string;
        const description = formData.get('description') as string;
        const max_places = formData.get('max_places') as string;

        if (!activity_name || !title || !event_date) return;

        await pool.query(
            `INSERT INTO activity_events (activity_name, title, event_date, description, max_places) 
             VALUES (?, ?, ?, ?, ?)`,
            [activity_name, title, event_date, description || null, max_places ? parseInt(max_places, 10) : null]
        );

        revalidatePath('/admin/evenements');
        revalidatePath('/admin/pages');
        revalidatePath(`/[slug]`);
    }

    async function deleteActivityEvent(formData: FormData) {
        'use server';
        const id = formData.get('id');
        if (!id) return;

        await pool.query('DELETE FROM activity_events WHERE id = ?', [id]);

        revalidatePath('/admin/evenements');
        revalidatePath('/admin/pages');
        revalidatePath(`/[slug]`);
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-16">

            {/* ========================================================== */}
            {/* SECTION 1 : BANDEAU D'ACTUALITÉ                            */}
            {/* ========================================================== */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <div className="bg-blue-600 p-2 rounded-xl text-white">
                        <Megaphone size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Gestion du Bandeau d'Actualité</h1>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Configurez les messages généraux défilant sur le haut du site</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulaire d'actualité */}
                    <div className={`p-6 rounded-2xl shadow-sm border h-fit transition-colors ${eventToEdit ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-xl font-bold flex items-center gap-2 ${eventToEdit ? 'text-amber-800' : 'text-slate-800'}`}>
                                {eventToEdit ? <Pencil size={20} className="text-amber-600" /> : <PlusCircle size={20} className="text-blue-600" />}
                                {eventToEdit ? 'Modifier le message' : 'Ajouter un message'}
                            </h2>
                            {eventToEdit && (
                                <Link href="/admin/evenements" className="text-amber-600 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 p-1.5 rounded-lg transition-colors">
                                    <X size={18} />
                                </Link>
                            )}
                        </div>

                        <form key={eventToEdit?.id || 'new_news'} action={saveEvent} className="space-y-4">
                            {eventToEdit && <input type="hidden" name="id" value={eventToEdit.id} />}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date ou Mention</label>
                                <input type="text" name="date_text" defaultValue={eventToEdit?.date_text || ''} placeholder="ex: URGENT, NOVEMBRE 2026" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Message principal <span className="text-pink-500">*</span></label>
                                <textarea name="main_text" required defaultValue={eventToEdit?.main_text || ''} rows={3} placeholder="ex: Inscriptions ouvertes pour le stage de Toussaint" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none bg-white outline-none" />
                            </div>
                            <div className="p-4 bg-white/60 rounded-lg border border-slate-200/60 space-y-3">
                                <h3 className="text-xs font-bold text-slate-700">Bouton d'action (Optionnel)</h3>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Texte du bouton</label>
                                    <input type="text" name="link_text" defaultValue={eventToEdit?.link_text || ''} placeholder="ex: S'inscrire" className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Lien (URL)</label>
                                    <input type="text" name="link_url" defaultValue={eventToEdit?.link_url || ''} placeholder="https://..." className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white outline-none" />
                                </div>
                            </div>
                            <button type="submit" className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-lg transition-colors text-sm text-white ${eventToEdit ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                <Save size={18} /> {eventToEdit ? 'Enregistrer les modifications' : 'Publier le message'}
                            </button>
                        </form>
                    </div>

                    {/* Liste de l'actualité */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800">Messages actuellement en ligne</h2>
                            <span className="bg-slate-100 text-slate-600 py-1 px-3 rounded-full text-sm font-semibold">{rows.length} au total</span>
                        </div>
                        {rows.length === 0 ? (
                            <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-slate-500">Aucun message configuré.</div>
                        ) : (
                            <div className="space-y-3">
                                {rows.map((event: any, index: number) => (
                                    <div key={event.id} className={`bg-white rounded-xl border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${index < 3 ? 'border-blue-200 shadow-sm' : 'border-slate-200 opacity-60'}`}>
                                        <div className="flex-1">
                                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-2 ${index < 3 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{index < 3 ? `En ligne (Position ${index + 1})` : 'Archivé'}</span>
                                            <div className="flex items-center gap-2 text-pink-600 font-semibold text-xs mb-1">{event.date_text && <><Calendar size={14} /> {event.date_text}</>}</div>
                                            <p className="font-bold text-slate-800 text-sm">{event.main_text}</p>
                                            {event.link_url && event.link_text && (
                                                <a href={event.link_url} className="text-blue-600 text-xs hover:underline mt-1 inline-block">Bouton : {event.link_text} &rarr;</a>
                                            )}
                                        </div>
                                        <div className="shrink-0 flex items-center gap-2">
                                            <Link href={`/admin/evenements?edit=${event.id}`} className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 p-2 border border-transparent hover:border-amber-100 rounded-lg transition-colors"><Pencil size={18} /></Link>
                                            <form action={deleteEvent}>
                                                <input type="hidden" name="id" value={event.id} />
                                                <button type="submit" className="text-red-400 hover:text-white hover:bg-red-500 p-2 border border-transparent hover:border-red-500 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ========================================================== */}
            {/* SECTION 2 : STAGES & JOURNÉES D'ACTIVITÉS (RÉGIS)           */}
            {/* ========================================================== */}
            <section className="space-y-6 pt-4">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <div className="bg-pink-600 p-2 rounded-xl text-white">
                        <Calendar size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">Planification des Stages & Sorties</h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Créez des formulaires d'inscriptions spécifiques pour chaque page d'activité sportive</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulaire de création de stage */}
                    <div className="p-6 rounded-2xl shadow-sm border border-slate-200 bg-white h-fit">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                            <PlusCircle size={20} className="text-pink-600" /> Planifier un stage
                        </h2>

                        <form action={createActivityEvent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Activité ciblée</label>
                                <select name="activity_name" required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 focus:ring-2 focus:ring-pink-500 outline-none">
                                    <option value="">-- Choisir l'activité --</option>
                                    <option value="escalade">Escalade</option>
                                    <option value="kayak">Kayak & Paddle</option>
                                    <option value="velo">Vélo / Cyclisme</option>
                                    <option value="srav">SRAV (Savoir rouler à vélo)</option>
                                    <option value="tir">Tir à l'arc</option>
                                    <option value="rando">Randonnées</option>
                                    <option value="secourisme">Formations Secourisme</option>
                                    <option value="renforcement">Renforcement & Stretching</option>
                                    <option value="massages">Massages Bien-être</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nom du stage / de l'événement</label>
                                <input type="text" name="title" required placeholder="ex: Journée Découverte Falaise" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 focus:ring-2 focus:ring-pink-500 outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date planifiée</label>
                                <input type="date" name="event_date" required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 focus:ring-2 focus:ring-pink-500 outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre max de participants (Optionnel)</label>
                                <input type="number" name="max_places" placeholder="ex: 12 (vide si illimité)" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 focus:ring-2 focus:ring-pink-500 outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description & Organisation</label>
                                <textarea name="description" rows={4} placeholder="Rendez-vous à 9h, matériel requis, pique nique..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 resize-none focus:ring-2 focus:ring-pink-500 outline-none" />
                            </div>

                            <button type="submit" className="w-full flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-lg transition-colors text-sm text-white bg-pink-600 hover:bg-pink-700">
                                <Save size={18} /> Publier la sortie
                            </button>
                        </form>
                    </div>

                    {/* Liste des stages configurés */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold text-slate-800">Stages et sorties enregistrés</h2>
                        {activityEvents.length === 0 ? (
                            <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-slate-500">Aucun stage planifié pour le moment.</div>
                        ) : (
                            <div className="space-y-3">
                                {activityEvents.map((evt: any) => (
                                    <div key={evt.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-pink-50 border border-pink-200 text-pink-700 px-2 py-0.5 rounded-full">{evt.activity_name}</span>
                                                <h3 className="font-bold text-slate-800 text-sm truncate">{evt.title}</h3>
                                            </div>
                                            <div className="text-xs text-slate-400 font-medium flex items-center gap-4">
                                                <span>📅 {new Date(evt.event_date).toLocaleDateString('fr-FR')}</span>
                                                {evt.max_places && <span>👥 Limite : {evt.max_places} places</span>}
                                            </div>
                                        </div>
                                        <div className="shrink-0 flex items-center gap-2 justify-end">
                                            <Link href={`/admin/inscriptions/${evt.id}`} className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors">
                                                <Users size={14} /> Voir les inscrits
                                            </Link>
                                            <form action={deleteActivityEvent}>
                                                <input type="hidden" name="id" value={evt.id} />
                                                <button type="submit" className="text-slate-300 hover:text-red-600 p-2 rounded-lg transition-colors" title="Supprimer le stage"><Trash2 size={18} /></button>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

        </div>
    );
}