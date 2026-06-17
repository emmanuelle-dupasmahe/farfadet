import React from 'react';
import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { UserPlus, Trash2, ShieldCheck, Mail, Lock } from 'lucide-react';
import bcrypt from 'bcrypt';

export const dynamic = 'force-dynamic';

export default async function AdminManagement() {
    // 1. Récupérer la liste des utilisateurs ayant le rôle 'admin'
    // On suppose que ta table a une colonne 'role'. Si elle n'en a pas,
    // tu peux enlever la clause "WHERE role = 'admin'".
    let users = [];
    try {
        const [rows] = await pool.query('SELECT id, email FROM users ORDER BY id ASC') as any;
        users = rows;
    } catch (error) {
        console.error("Erreur de récupération des utilisateurs:", error);
    }

    // 2. Action pour ajouter un administrateur
    async function addAdmin(formData: FormData) {
        'use server';
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) return;

        // Sécurisation du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            // Insertion dans la table 'users'.
            // Si ta table a une colonne 'role', ajoute-la ici :
            // 'INSERT INTO users (email, password, role) VALUES (?, ?, "admin")'
            await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
            revalidatePath('/admin/equipe');
        } catch (error) {
            console.error("Erreur ajout admin:", error);
        }
    }

    // 3. Action pour supprimer un administrateur
    async function deleteAdmin(formData: FormData) {
        'use server';
        const id = formData.get('id');

        // Sécurité : Empêcher de supprimer s'il ne reste qu'un seul compte
        if (users.length <= 1) return;

        try {
            await pool.query('DELETE FROM users WHERE id = ?', [id]);
            revalidatePath('/admin/equipe');
        } catch (error) {
            console.error("Erreur suppression admin:", error);
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-emerald-600 p-2 rounded-xl text-white">
                    <ShieldCheck size={28} />
                </div>
                <h1 className="text-3xl font-bold text-slate-800">Gestion de l'Équipe</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Formulaire d'ajout */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <UserPlus size={20} className="text-emerald-600" />
                        Nouvel Administrateur
                    </h2>
                    <form action={addAdmin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Adresse Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input name="email" type="email" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm" placeholder="nouveau@mail.com" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe provisoire</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input name="password" type="password" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm" placeholder="••••••••" />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Créer le compte
                        </button>
                    </form>
                </div>

                {/* Liste des administrateurs */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Accès autorisés ({users.length})</h2>

                    {users.map((user: any) => (
                        <div key={user.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                    <ShieldCheck size={20} />
                                </div>
                                <span className="text-slate-700 font-medium">{user.email}</span>
                            </div>

                            {/* N'affiche le bouton supprimer que s'il y a plus d'un admin */}
                            {users.length > 1 && (
                                <form action={deleteAdmin}>
                                    <input type="hidden" name="id" value={user.id} />
                                    <button type="submit" className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer cet accès">
                                        <Trash2 size={18} />
                                    </button>
                                </form>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}