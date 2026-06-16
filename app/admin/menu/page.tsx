import React from 'react';
import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { FileText, Save, Trash2, PlusCircle, Pencil, X } from 'lucide-react';


export const dynamic = 'force-dynamic';

export default async function AdminMenuPage(props: {
    searchParams: Promise<{ edit?: string }>;
}) {
    const params = await props.searchParams;
    const editId = params?.edit;

    // 1. Récupérer tous les éléments du menu
    const [allRows] = await pool.query('SELECT * FROM header_menu ORDER BY parent_id ASC, position ASC') as any;

    // Filtrer les parents disponibles pour le sélecteur du formulaire
    const parentMenus = allRows.filter((item: any) => item.parent_id === null);

    // Trouver l'élément à modifier si on est en mode édition
    const itemToEdit = editId ? allRows.find((m: any) => m.id.toString() === editId) : null;

    // 2. Action : Sauvegarder (Ajouter / Modifier)
    async function saveMenuItem(formData: FormData) {
        'use server';

        const id = formData.get('id') as string;
        const label = formData.get('label') as string;
        const url = formData.get('url') as string;
        const parent_id = formData.get('parent_id') as string;
        const position = formData.get('position') as string;

        if (!label) return;

        const parsedParentId = parent_id === 'none' ? null : parseInt(parent_id);
        const parsedPosition = position ? parseInt(position) : 0;
        const parsedUrl = url || null;

        if (id) {
            // Mode édition
            await pool.query(
                'UPDATE header_menu SET label = ?, url = ?, parent_id = ?, position = ? WHERE id = ?',
                [label, parsedUrl, parsedParentId, parsedPosition, id]
            );
        } else {
            // Mode création
            await pool.query(
                'INSERT INTO header_menu (label, url, parent_id, position) VALUES (?, ?, ?, ?)',
                [label, parsedUrl, parsedParentId, parsedPosition]
            );
        }

        revalidatePath('/admin/menu');
        revalidatePath('/', 'layout');

        // Force le navigateur à recharger la page SANS le ?edit=...
        redirect('/admin/menu');
    }

    // 3. Action : Supprimer
    async function deleteMenuItem(formData: FormData) {
        'use server';

        const id = formData.get('id');
        if (!id) return;

        await pool.query('DELETE FROM header_menu WHERE id = ?', [id]);

        revalidatePath('/admin/menu');
        revalidatePath('/', 'layout');
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">

            <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                    <FileText size={28} />
                </div>
                <h1 className="text-3xl font-bold text-slate-800">Gestion du Menu Supérieur (Header)</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Formulaire d'ajout / modification */}
                <div className={`p-6 rounded-2xl shadow-sm border h-fit ${itemToEdit ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-xl font-bold flex items-center gap-2 ${itemToEdit ? 'text-amber-800' : 'text-slate-800'}`}>
                            {itemToEdit ? <Pencil size={20} /> : <PlusCircle size={20} />}
                            {itemToEdit ? 'Modifier le lien' : 'Ajouter un lien'}
                        </h2>
                        {itemToEdit && (
                            <a href="/admin/menu" className="text-amber-600 hover:bg-amber-200 p-1.5 rounded-lg">
                                <X size={18} />
                            </a>
                        )}
                    </div>

                    <form key={itemToEdit?.id || 'new'} action={saveMenuItem} className="space-y-4">
                        {itemToEdit && <input type="hidden" name="id" value={itemToEdit.id} />}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l'onglet (Libellé)</label>
                            <input type="text" name="label" required defaultValue={itemToEdit?.label || ''} placeholder="ex: Escalade" className="w-full px-3 py-2 border rounded-lg text-sm bg-white text-slate-800" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Adresse du lien (URL)</label>
                            <input type="text" name="url" defaultValue={itemToEdit?.url || ''} placeholder="ex: /escalade (laisser vide si menu déroulant)" className="w-full px-3 py-2 border rounded-lg text-sm bg-white text-slate-800" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Menu Parent</label>
                            <select name="parent_id" defaultValue={itemToEdit?.parent_id || 'none'} className="w-full px-3 py-2 border rounded-lg text-sm bg-white text-slate-800">
                                <option value="none">Aucun (En tant qu'onglet principal)</option>
                                {parentMenus.map((p: any) => (
                                    <option key={p.id} value={p.id}>Dans le menu : {p.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Ordre d'affichage (Position)</label>
                            <input type="number" name="position" defaultValue={itemToEdit?.position || 0} className="w-full px-3 py-2 border rounded-lg text-sm bg-white text-slate-800" />
                        </div>

                        <button type="submit" className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-lg text-sm text-white ${itemToEdit ? 'bg-amber-600' : 'bg-blue-600'}`}>
                            <Save size={18} /> Enregistrer
                        </button>
                    </form>
                </div>

                {/* Liste structurelle des menus */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800">Structure actuelle du Header</h2>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        {parentMenus.map((parent: any) => {
                            const children = allRows.filter((c: any) => c.parent_id === parent.id);

                            return (
                                <div key={parent.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                    {/* Ligne du parent */}
                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border">
                                        <div>
                                            <span className="font-bold text-slate-800">{parent.label}</span>
                                            {parent.url ? (
                                                <span className="ml-2 text-xs text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded">{parent.url}</span>
                                            ) : (
                                                <span className="ml-2 text-xs text-purple-600 font-mono bg-purple-50 px-2 py-0.5 rounded">Menu Déroulant</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <a href={`/admin/menu?edit=${parent.id}`} className="p-1.5 text-slate-500 hover:text-amber-600"><Pencil size={16} /></a>
                                            <form action={deleteMenuItem} className="inline">
                                                <input type="hidden" name="id" value={parent.id} />
                                                <button type="submit" className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                                            </form>
                                        </div>
                                    </div>

                                    {/* Liste des enfants */}
                                    {children.length > 0 && (
                                        <div className="mt-2 ml-8 space-y-2 border-l-2 border-slate-200 pl-4">
                                            {children.map((child: any) => (
                                                <div key={child.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 shadow-xs">
                                                    <span className="text-sm text-slate-700">{child.label} <span className="text-xs text-slate-400 font-mono">({child.url})</span></span>
                                                    <div className="flex items-center gap-1">
                                                        <a href={`/admin/menu?edit=${child.id}`} className="p-1 text-slate-400 hover:text-amber-600"><Pencil size={14} /></a>
                                                        <form action={deleteMenuItem} className="inline">
                                                            <input type="hidden" name="id" value={child.id} />
                                                            <button type="submit" className="p-1 text-slate-300 hover:text-red-600"><Trash2 size={14} /></button>
                                                        </form>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}