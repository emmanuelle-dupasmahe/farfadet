import React from 'react';
import pool from '@/lib/db';
import {
    Image as ImageIcon,
    Megaphone,
    ShieldCheck,
    FileText,
    Settings,
    Layers,
    Users,
    CreditCard
} from 'lucide-react';

export default async function AdminDashboard() {
    // Requêtes pour compter le total des inscriptions dans les deux tables
    const [siteResult]: any = await pool.query('SELECT COUNT(*) as count FROM activity_registrations');
    const [helloAssoResult]: any = await pool.query('SELECT COUNT(*) as count FROM event_registrations');

    // Sécurisation de la récupération (affiche 0 si la table est vide)
    const siteCount = siteResult[0]?.count || 0;
    const helloAssoCount = helloAssoResult[0]?.count || 0;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Vue d'ensemble</h1>

            {/* NOUVEAU : Section des indicateurs rapides */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* Indicateur Inscriptions Site */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                            <Users size={32} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Inscriptions Site</p>
                            <p className="text-3xl font-extrabold text-slate-900">{siteCount}</p>
                        </div>
                    </div>
                    <a href="/admin/inscriptions" className="text-blue-600 font-medium hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                        Voir &rarr;
                    </a>
                </div>

                {/* Indicateur Inscriptions HelloAsso */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
                            <CreditCard size={32} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Inscriptions HelloAsso</p>
                            <p className="text-3xl font-extrabold text-slate-900">{helloAssoCount}</p>
                        </div>
                    </div>
                    <a href="/admin/helloasso-inscriptions" className="text-emerald-600 font-medium hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors">
                        Voir &rarr;
                    </a>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-6">Gestion du site</h2>

            {/* Grille adaptative : 1 colonne sur mobile, 2 sur tablette, 3 sur grand écran */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1. Carte Médiathèque */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-pink-100 p-3 rounded-lg text-pink-600">
                                <ImageIcon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Médiathèque</h3>
                        </div>
                        <p className="text-slate-600 mb-6">
                            Gérez les photos qui s'affichent dans les carrousels de toutes vos pages d'activités.
                        </p>
                    </div>
                    <a href="/admin/photos" className="text-pink-600 font-semibold hover:underline">
                        Gérer les photos &rarr;
                    </a>
                </div>

                {/* 2. Carte Textes des pages */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-teal-100 p-3 rounded-lg text-teal-600">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Textes des pages</h3>
                        </div>
                        <p className="text-slate-600 mb-6">
                            Éditez le contenu, le grand titre fuchsia de l'accueil et les textes de vos activités.
                        </p>
                    </div>
                    <a href="/admin/pages" className="text-teal-600 font-semibold hover:underline">
                        Modifier les textes &rarr;
                    </a>
                </div>

                {/* 3. Carte d'activités (Accueil) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                                <Layers size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Cartes d'activités</h3>
                        </div>
                        <p className="text-slate-600 mb-6">
                            Configurez les 3 grandes cartes de présentation affichées sur la page d'accueil.
                        </p>
                    </div>
                    <a href="/admin/cards" className="text-purple-600 font-semibold hover:underline">
                        Gérer les cartes &rarr;
                    </a>
                </div>

                {/* 4. Carte Menu du Header */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-amber-100 p-3 rounded-lg text-amber-600">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Menu du Header</h3>
                        </div>
                        <p className="text-slate-600 mb-6">
                            Gérez les liens de navigation affichés tout en haut de votre site internet.
                        </p>
                    </div>
                    <a href="/admin/menu" className="text-amber-600 font-semibold hover:underline">
                        Modifier le menu &rarr;
                    </a>
                </div>

                {/* 5. Carte Gestion du Footer */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-slate-100 p-3 rounded-lg text-slate-600">
                                <Settings size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Gestion du Footer</h3>
                        </div>
                        <p className="text-slate-600 mb-6">
                            Modifiez les coordonnées de contact (Sarah, Régis) et les liens des réseaux sociaux.
                        </p>
                    </div>
                    <a href="/admin/configuration" className="text-slate-600 font-semibold hover:underline">
                        Paramétrer le footer &rarr;
                    </a>
                </div>

                {/* 6. Carte Raccourci Événements */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                                <Megaphone size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Bandeau d'actualité</h3>
                        </div>
                        <p className="text-slate-600 mb-6">
                            Modifiez le message d'urgence ou l'événement affiché tout en haut du site.
                        </p>
                    </div>
                    <a href="/admin/evenements" className="text-blue-600 font-semibold hover:underline">
                        Modifier le bandeau &rarr;
                    </a>
                </div>

                {/* 7. Carte Gestion de l'équipe */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">L'Équipe</h3>
                        </div>
                        <p className="text-slate-600 mb-6">
                            Ajoutez ou supprimez des accès sécurisés au tableau de bord pour les membres.
                        </p>
                    </div>
                    <a href="/admin/equipe" className="text-emerald-600 font-semibold hover:underline">
                        Gérer les accès &rarr;
                    </a>
                </div>

            </div>
        </div>
    );
}