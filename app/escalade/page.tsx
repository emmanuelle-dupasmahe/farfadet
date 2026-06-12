import React from 'react';
import PhotoCarousel from "@/components/PhotoCarousel";
import Link from 'next/link';
import { Mountain, Users, Calendar, Phone, ArrowLeft } from 'lucide-react';

export default function EscaladePage() {
    const escaladePhotos = [
        { src: "/photos/escalade/grimpe1.jpg", alt: "Enfant qui grimpe", caption: "Initiation pour les 9-16 ans" },
        { src: "/photos/escalade/grimpe2.jpg", alt: "Escalade sur voie avec baudrier", caption: "Défier ses limites" },
        { src: "/photos/escalade/grimpe3.jpg", alt: "Après l'effort", caption: "Après l'effort" },
    ];
    return (
        <div className="min-h-screen bg-slate-50 pb-20">

            {/* 1. En-tête de la page (Hero Section) */}
            <section className="w-full bg-blue-950 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 font-semibold mb-6 transition-colors">
                        <ArrowLeft size={20} /> Retour à l'accueil
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-pink-600 p-3 rounded-2xl">
                            <Mountain size={40} className="text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold">Escalade</h1>
                    </div>
                    <p className="text-xl text-slate-300 max-w-2xl">
                        Prendre de la hauteur et défier ses limites en toute sécurité, dans un cadre adapté à tous les niveaux.
                    </p>
                    <PhotoCarousel images={escaladePhotos} />
                </div>
            </section>

            {/* 2. Contenu principal */}
            <main className="max-w-4xl mx-auto px-4 -mt-8">
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 md:p-12">

                    {/* Bloc d'informations pratiques (Les "Tags") */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 pb-8 border-b border-slate-100">
                        <div className="flex items-start gap-4">
                            <Users className="text-pink-600 shrink-0" size={28} />
                            <div>
                                <h3 className="font-bold text-slate-900">Public</h3>
                                <p className="text-slate-600 text-sm">Enfants (9-16 ans), IME, Centres spécialisés</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Calendar className="text-pink-600 shrink-0" size={28} />
                            <div>
                                <h3 className="font-bold text-slate-900">Période</h3>
                                <p className="text-slate-600 text-sm">Toute la période scolaire & vacances (sur dossier)</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Mountain className="text-pink-600 shrink-0" size={28} />
                            <div>
                                <h3 className="font-bold text-slate-900">Lieu</h3>
                                <p className="text-slate-600 text-sm">En extérieur ou salle adaptée selon météo</p>
                            </div>
                        </div>
                    </div>

                    {/* Description détaillée */}
                    <div className="prose prose-slate max-w-none">
                        <h2 className="text-2xl font-bold text-blue-950 mb-4">Le programme d'escalade</h2>
                        <p className="text-slate-700 leading-relaxed mb-6">
                            L'escalade est un outil formidable pour le développement psychomoteur et la confiance en soi.
                            Encadrés par des professionnels formés au sport adapté, les participants apprennent à gérer leurs
                            émotions, à appréhender le vide et à développer leur esprit d'entraide.
                        </p>
                        <p className="text-slate-700 leading-relaxed mb-6">
                            Nos séances sont entièrement personnalisées en fonction des capacités de chaque groupe, que ce soit
                            pour une initiation en bloc ou de la grimpe sur voie avec baudrier. L'objectif principal reste
                            le plaisir de l'effort et l'inclusion totale de chaque participant.
                        </p>
                    </div>

                    {/* 3. Appel à l'action (Contact) */}
                    <div className="mt-12 bg-pink-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-pink-100">
                        <div>
                            <h3 className="text-xl font-bold text-pink-600 mb-2">Envie de participer ?</h3>
                            <p className="text-slate-700">Demandez votre devis ou votre prestation personnalisée.</p>
                        </div>
                        <a
                            href="tel:0620784914"
                            className="w-full md:w-auto inline-flex justify-center items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-bold transition-colors"
                        >
                            <Phone size={20} /> Contacter Sarah
                        </a>
                    </div>

                </div>
            </main>
        </div>
    );
}