import React from 'react';
import { Image as ImageIcon, Megaphone } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Vue d'ensemble</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Carte Raccourci Photos */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-pink-100 p-3 rounded-lg text-pink-600">
                            <ImageIcon size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Photos Escalade</h2>
                    </div>
                    <p className="text-slate-600 mb-6">
                        Gérez les photos qui s'affichent dans le carrousel de la page d'escalade.
                    </p>
                    <a href="/admin/photos" className="text-pink-600 font-semibold hover:underline">
                        Gérer les photos &rarr;
                    </a>
                </div>

                {/* Carte Raccourci Événements */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                            <Megaphone size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Bandeau d'actualité</h2>
                    </div>
                    <p className="text-slate-600 mb-6">
                        Modifiez le message d'urgence ou l'événement affiché en haut du site.
                    </p>
                    <a href="/admin/evenements" className="text-blue-600 font-semibold hover:underline">
                        Modifier le bandeau &rarr;
                    </a>
                </div>
            </div>
        </div>
    );
}