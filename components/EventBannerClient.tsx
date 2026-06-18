"use client";

import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Pause, Play, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link'; // Importation nécessaire pour la page tampon

// On reçoit toujours notre tableau d'événements
export default function EventBannerClient({ dbEvents }: { dbEvents: any[] }) {
    // Si la base est vide, on cache le bandeau
    if (!dbEvents || dbEvents.length === 0) return null;

    // On vérifie s'il y a plus d'un événement pour activer l'animation
    const isMultiple = dbEvents.length > 1;

    // On n'initialise le plugin Autoplay que s'il y a plusieurs slides
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: isMultiple, active: isMultiple },
        isMultiple ? [Autoplay({ delay: 5000, stopOnInteraction: false })] : []
    );

    const [isPlaying, setIsPlaying] = useState(true);

    const toggleAutoplay = useCallback(() => {
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (!autoplay) return;

        const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play;
        playOrStop();
        setIsPlaying(autoplay.isPlaying());
    }, [emblaApi]);

    useEffect(() => {
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (!autoplay) return;

        setIsPlaying(autoplay.isPlaying());
        emblaApi
            .on('autoplay:play', () => setIsPlaying(true))
            .on('autoplay:stop', () => setIsPlaying(false))
            .on('reInit', () => setIsPlaying(autoplay.isPlaying()));
    }, [emblaApi]);

    return (
        <div className="relative bg-blue-950 text-white w-full border-y-4 border-pink-600">
            <div className="max-w-7xl mx-auto flex items-center px-4 py-3">

                <div className="overflow-hidden flex-grow" ref={emblaRef}>
                    <div className="flex">
                        {/* On crée une slide pour chaque événement */}
                        {dbEvents.map((dbEvent) => {
                            // Sécurité : On détecte si le lien configuré est une page interne (comme /inscriptions)
                            const isInternalLink = dbEvent.link_url?.startsWith('/');

                            return (
                                <div key={dbEvent.id} className="flex-[0_0_100%] min-w-0 flex items-center justify-between gap-4 md:px-8">

                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                                        {dbEvent.date_text && (
                                            <span className="flex items-center gap-2 text-pink-400 font-semibold uppercase tracking-wider text-sm">
                                                <Calendar size={18} />
                                                {dbEvent.date_text}
                                            </span>
                                        )}
                                        <div>
                                            <strong className="text-lg md:text-xl font-bold">{dbEvent.main_text}</strong>
                                        </div>
                                    </div>

                                    {dbEvent.link_url && dbEvent.link_text && (
                                        <>
                                            {isInternalLink ? (
                                                /* --- CAS 1 : Lien interne vers ta page tampon --- */
                                                <Link
                                                    href={dbEvent.link_url}
                                                    className="shrink-0 flex items-center gap-2 bg-pink-600 hover:bg-pink-700 transition-colors text-white px-4 py-2 rounded-full font-bold text-sm"
                                                >
                                                    {dbEvent.link_text}
                                                </Link>
                                            ) : (
                                                /* --- CAS 2 : Lien externe classique (ex: HelloAsso direct, Facebook, etc.) --- */
                                                <a
                                                    href={dbEvent.link_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="shrink-0 flex items-center gap-2 bg-pink-600 hover:bg-pink-700 transition-colors text-white px-4 py-2 rounded-full font-bold text-sm"
                                                >
                                                    {dbEvent.link_text} <ExternalLink size={16} />
                                                </a>
                                            )}
                                        </>
                                    )}

                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* On n'affiche le bouton pause que s'il y a plusieurs événements à faire défiler */}
                {isMultiple && (
                    <button
                        className="ml-4 shrink-0 bg-slate-800 hover:bg-slate-700 p-2 rounded-full text-slate-300 transition-colors focus:ring-2 focus:ring-pink-500 outline-none"
                        onClick={toggleAutoplay}
                        aria-label={isPlaying ? "Mettre le défilement en pause" : "Lancer le défilement"}
                        title={isPlaying ? "Mettre en pause" : "Lecture"}
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                )}

            </div>
        </div>
    );
}