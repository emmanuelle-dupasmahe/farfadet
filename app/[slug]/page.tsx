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

    // 1. Récupérer uniquement les données textuelles de la page
    const [pageRows] = await pool.query(`
        SELECT * FROM custom_pages WHERE slug = ?
    `, [slug]) as any;

    if (pageRows.length === 0) {
        notFound();
    }

    const page = pageRows[0];

    // 2. Récupérer TOUS les événements actifs liés à cette page
    
    const [eventRows] = await pool.query(`
        SELECT id, title AS event_title, event_date, description AS event_description
        FROM activity_events 
        WHERE activity_name = ? AND is_active = 1
        ORDER BY event_date ASC
    `, [slug]) as any;

    // 3. Récupérer les photos liées à cette catégorie spécifique
    const [photoRows] = await pool.query('SELECT src FROM photos WHERE category = ? ORDER BY id DESC', [slug]) as any;
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

            {/* FORMULAIRE DES INSCRIPTIONS : Boucle d'affichage dynamique */}
            {eventRows.length > 0 && (
                <section id="inscription" className="max-w-5xl mx-auto px-4 pb-12 space-y-8">
                    {eventRows.map((event: any) => (
                        <ActivityEventRegistration
                            key={event.id}
                            event={{
                                id: event.id,
                                title: event.event_title,
                                event_date: event.event_date,
                                description: event.event_description
                            }}
                        />
                    ))}
                </section>
            )}
        </main>
    );
}