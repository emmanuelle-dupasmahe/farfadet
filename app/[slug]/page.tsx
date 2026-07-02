import React from 'react';
import pool from '@/lib/db';
import { notFound } from 'next/navigation';
import PageCarousel from '@/components/PageCarousel';
import ActivityEventRegistration from '@/components/ActivityEventRegistration'; 

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function DynamicActivityPage({ params }: PageProps) {
    const { slug } = await params;

    // 1. Récupérer les données textuelles de la page ET l'événement lié s'il existe et est actif
    const [pageRows] = await pool.query(`
        SELECT 
            p.*, 
            e.id AS event_id, 
            e.title AS event_title, 
            e.event_date, 
            e.description AS event_description
        FROM custom_pages p
        LEFT JOIN activity_events e ON p.active_event_id = e.id AND e.is_active = 1
        WHERE p.slug = ?
    `, [slug]) as any;

    if (pageRows.length === 0) {
        notFound();
    }

    const page = pageRows[0];

    // Reconstruction de l'objet event s'il y en a un de rattaché
    const attachedEvent = page.event_id ? {
        id: page.event_id,
        title: page.event_title,
        event_date: page.event_date,
        description: page.event_description
    } : null;

    // 2. Récupérer les photos liées à cette catégorie spécifique dans la table 'photos'
    const [photoRows] = await pool.query('SELECT src FROM photos WHERE category = ? ORDER BY id DESC', [slug]) as any;

    // Transformation du résultat en un tableau simple d'URLs de chaînes de caractères
    const carouselImages = photoRows.map((photo: any) => photo.src);

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="w-full bg-blue-950 text-white py-20 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-pink-500 mb-4">
                        {page.title}
                    </h1>
                    {page.subtitle && (
                        <p className="text-xl text-slate-300 font-medium">
                            {page.subtitle}
                        </p>
                    )}
                </div>
            </section>

            {/* Zone de contenu principale */}
            <div className="max-w-5xl mx-auto px-4 py-12">

                {/* Carrousel alimenté directement par le module photo existant */}
                {carouselImages.length > 0 && <PageCarousel images={carouselImages} />}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Colonne Description */}
                    <div className="md:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Présentation de l'activité</h2>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line text-base">
                            {page.content}
                        </p>
                    </div>

                    {/* Colonne Infos Pratiques */}
                    {page.practical_info && (
                        <div className="bg-pink-50 border border-pink-200 p-6 rounded-2xl shadow-sm h-fit">
                            <h3 className="text-xl font-bold text-pink-700 mb-4">Infos Pratiques</h3>
                            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium">
                                {page.practical_info}
                            </p>
                        </div>
                    )}

                </div>

            </div>

            {/* FORMULAIRE DES INSCRIPTIONS */}
            {attachedEvent && (
                <section id="inscription" className="max-w-5xl mx-auto px-4 pb-12">
                    <ActivityEventRegistration event={attachedEvent} />
                </section>
            )}
        </main>
    );
}