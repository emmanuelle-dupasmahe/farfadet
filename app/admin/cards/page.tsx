import React from 'react';
import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Layers, Save, Trash2, PlusCircle, Pencil, X } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCardsPage(props: {
    searchParams: Promise<{ edit?: string }>;
}) {
    const params = await props.searchParams;
    const editId = params?.edit;

    // 1. Récupérer TOUTES les cartes d'activités
    const [rows] = await pool.query('SELECT * FROM home_cards ORDER BY id ASC') as any;

    // 2. Vérifier si on est en mode édition
    const cardToEdit = editId ? rows.find((c: any) => c.id.toString() === editId) : null;

    // 3. Action du serveur pour sauvegarder (Ajout ET Modification)
    async function saveCard(formData: FormData) {
        'use server';

        const id = formData.get('id') as string;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const link_url = formData.get('link_url') as string;

        if (!title || !description) return;

        if (id) {
            // En mode édition : UPDATE
            await pool.query(
                'UPDATE home_cards SET title = ?, description = ?, link_url = ? WHERE id = ?',
                [title, description, link_url || null, id]
            );
        } else {
            // En mode création : INSERT
            await pool.query(
                'INSERT INTO home_cards (title, description, link_url) VALUES (?, ?, ?)',
                [title, description, link_url || null]
            );
        }

        revalidatePath('/admin/cards');
        revalidatePath('/'); // Met à jour la page d'accueil publique
    }

    // 4. Action du serveur pour supprimer une carte
    async function deleteCard(formData: FormData) {
        'use server';

        const id = formData.get('id');
        if (!id) return;

        await pool.query('DELETE FROM home_cards WHERE id = ?', [id]);

        revalidatePath('/admin/cards');
        revalidatePath('/');
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">

            <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                    <Layers size={28} />
                </div>
                <h1 className="text-3xl font-bold text-slate-800">Gestion des Cartes d'Activité</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Colonne de gauche : Formulaire (Clé unique pour éviter le blocage des champs) */}
                <div className={`p-6 rounded-2xl shadow-sm border h-fit transition-colors ${cardToEdit ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-xl font-bold flex items-center gap-2 ${cardToEdit ? 'text-amber-800' : 'text-slate-800'}`}>
                            {cardToEdit ? <Pencil size={20} className="text-amber-600" /> : <PlusCircle size={20} className="text-blue-600" />}
                            {cardToEdit ? 'Modifier la carte' : 'Ajouter une carte'}
                        </h2>

                        {cardToEdit && (
                            <a href="/admin/cards" className="text-amber-600 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 p-1.5 rounded-lg transition-colors">
                                <X size={18} />
                            </a>
                        )}
                    </div>

                    <form key={cardToEdit?.id || 'new'} action={saveCard} className="space-y-4">
                        {cardToEdit && <input type="hidden" name="id" value={cardToEdit.id} />}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Titre de l'activité</label>
                            <input
                                type="text"
                                name="title"
                                required
                                defaultValue={cardToEdit?.title || ''}
                                placeholder="ex: Savoir Rouler à Vélo (SRAV)"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description courte</label>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                defaultValue={cardToEdit?.description || ''}
                                placeholder="ex: Apprentissage du vélo en milieu sécurisé pour les jeunes..."
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Lien de redirection (URL)</label>
                            <input
                                type="text"
                                name="link_url"
                                defaultValue={cardToEdit?.link_url || ''}
                                placeholder="ex: /kayak ou /escalade"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white"
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-lg transition-colors text-sm text-white ${cardToEdit ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            <Save size={18} />
                            {cardToEdit ? 'Enregistrer les modifications' : 'Créer la carte'}
                        </button>
                    </form>
                </div>

                {/* Colonne de droite : Liste des cartes */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800">Cartes affichées sur l'accueil ({rows.length})</h2>

                    {rows.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-slate-500">
                            Aucune carte d'activité n'est créée pour le moment.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {rows.map((card: any) => (
                                <div key={card.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-4 shadow-sm">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-800 text-base">{card.title}</h3>
                                        <p className="text-slate-600 text-xs mt-1 leading-relaxed">{card.description}</p>
                                        {card.link_url && (
                                            <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-mono px-2 py-0.5 rounded mt-2">
                                                Lien : {card.link_url}
                                            </span>
                                        )}
                                    </div>

                                    <div className="shrink-0 flex items-center gap-2">
                                        <a
                                            href={`/admin/cards?edit=${card.id}`}
                                            className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 p-2 border border-transparent hover:border-amber-100 rounded-lg transition-colors"
                                            title="Modifier cette carte"
                                        >
                                            <Pencil size={18} />
                                        </a>

                                        <form action={deleteCard}>
                                            <input type="hidden" name="id" value={card.id} />
                                            <button
                                                type="submit"
                                                className="text-red-400 hover:text-white hover:bg-red-500 p-2 border border-transparent hover:border-red-500 rounded-lg transition-colors"
                                                title="Supprimer cette carte"
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