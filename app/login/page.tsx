import React from 'react';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Lock } from 'lucide-react';

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
    // Lecture des paramètres d'URL (pour afficher les messages d'erreur)
    const searchParams = await props.searchParams;
    const error = searchParams?.error;

    // Action Serveur pour vérifier les identifiants
    async function handleLogin(formData: FormData) {
        'use server';

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            redirect('/login?error=missing');
        }

        // 1. Chercher l'utilisateur dans la base de données
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]) as any;
        const user = rows[0];

        // 2. Si l'utilisateur existe, comparer les mots de passe
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);

            // 3. Si c'est le bon mot de passe, on crée un cookie sécurisé
            if (isMatch) {
                const cookieStore = await cookies();
                cookieStore.set('admin_session', user.id.toString(), {
                    httpOnly: true, // Invisible pour le JavaScript (sécurité contre les failles XSS)
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 24 * 7, // Valable 7 jours
                    path: '/',
                });

                // Redirection vers le dashboard
                redirect('/admin');
            }
        }

        // En cas d'échec (mauvais email ou mauvais mot de passe)
        redirect('/login?error=invalid');
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-slate-200">

                <div className="flex flex-col items-center mb-8">
                    <div className="bg-blue-950 p-4 rounded-full text-pink-500 mb-4">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Espace Sécurisé</h1>
                    <p className="text-slate-500 text-sm mt-1">Les Farfadets Vertigo</p>
                </div>

                {error === 'invalid' && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 text-center font-medium">
                        Email ou mot de passe incorrect.
                    </div>
                )}

                {error === 'missing' && (
                    <div className="bg-amber-50 text-amber-700 p-3 rounded-lg text-sm mb-6 border border-amber-100 text-center font-medium">
                        Veuillez remplir tous les champs.
                    </div>
                )}

                <form action={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Adresse email
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="sarah@farfadets.fr"
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-4"
                    >
                        Se connecter
                    </button>
                </form>

            </div>
        </div>
    );
}