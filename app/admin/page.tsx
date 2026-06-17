import React from 'react';
import {
    Image as ImageIcon,
    Megaphone,
    ShieldCheck,
    FileText,
    Settings,
    Layers
} from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Vue d'ensemble</h1>

            {/* Grille adaptative : 1 colonne sur mobile, 2 sur tablette, 3 sur grand écran */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1. Carte Médiathèque */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-pink-100 p-3 rounded-lg text-pink-600">
                                <ImageIcon size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Médiathèque</h2>
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
                            <h2 className="text-xl font-bold text-slate-800">Textes des pages</h2>
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
                            <h2 className="text-xl font-bold text-slate-800">Cartes d'activités</h2>
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
                            <h2 className="text-xl font-bold text-slate-800">Menu du Header</h2>
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
                            <h2 className="text-xl font-bold text-slate-800">Gestion du Footer</h2>
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
                            <h2 className="text-xl font-bold text-slate-800">Bandeau d'actualité</h2>
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
                            <h2 className="text-xl font-bold text-slate-800">L'Équipe</h2>
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