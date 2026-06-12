"use client"; // Indispensable pour utiliser des hooks React comme useState ou useEffect

import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Pause, Play, Calendar, ExternalLink } from 'lucide-react';

export default function EventBanner() {
    // Initialisation du carrousel avec le plugin Autoplay
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 5000, stopOnInteraction: false })
    ]);

    const [isPlaying, setIsPlaying] = useState(true);

    // Fonction pour mettre en pause ou relancer le défilement
    const toggleAutoplay = useCallback(() => {
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (!autoplay) return;

        const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play;
        playOrStop();
        setIsPlaying(autoplay.isPlaying());
    }, [emblaApi]);

    // Écoute les changements d'état du carrousel en arrière-plan
    useEffect(() => {
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (!autoplay) return;

        setIsPlaying(autoplay.isPlaying());
        emblaApi
            .on('autoplay:play', () => setIsPlaying(true))
            .on('autoplay:stop', () => setIsPlaying(false))
            .on('reInit', () => setIsPlaying(autoplay.isPlaying()));
    }, [emblaApi]);

    // Données factices pour l'exemple (plus tard, cela viendra de ta base de données)
    const events = [
        {
            id: 1,
            title: "Course de 5kms solidaire",
            partner: "En partenariat avec le Rotary",
            date: "Novembre 2024",
            link: "#"
        },
        {
            id: 2,
            title: "Nouveau : Stage Multi-sports",
            partner: "Inscriptions ouvertes pour les prochaines vacances",
            date: "Vacances scolaires",
            link: "#"
        }
    ];

    return (
        <div className="relative bg-slate-900 text-white w-full border-y-4 border-pink-600">
            <div className="max-w-7xl mx-auto flex items-center px-4 py-3">

                {/* Le conteneur du défilement */}
                <div className="overflow-hidden flex-grow" ref={emblaRef}>
                    <div className="flex">
                        {events.map((event) => (
                            <div key={event.id} className="flex-[0_0_100%] min-w-0 flex items-center justify-between gap-4 md:px-8">

                                {/* Infos de l'événement */}
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                                    <span className="flex items-center gap-2 text-pink-400 font-semibold uppercase tracking-wider text-sm">
                                        <Calendar size={18} />
                                        {event.date}
                                    </span>
                                    <div>
                                        <strong className="text-lg md:text-xl font-bold">{event.title}</strong>
                                        <span className="hidden md:inline text-slate-300 ml-2"> - {event.partner}</span>
                                    </div>
                                </div>

                                {/* Bouton d'inscription (vers HelloAsso plus tard) */}
                                <a
                                    href={event.link}
                                    className="shrink-0 flex items-center gap-2 bg-pink-600 hover:bg-pink-700 transition-colors text-white px-4 py-2 rounded-full font-bold text-sm"
                                >
                                    S'inscrire <ExternalLink size={16} />
                                </a>

                            </div>
                        ))}
                    </div>
                </div>

                {/* Le bouton Pause/Lecture obligatoire pour l'accessibilité (RGAA) */}
                <button
                    className="ml-4 shrink-0 bg-slate-800 hover:bg-slate-700 p-2 rounded-full text-slate-300 transition-colors focus:ring-2 focus:ring-pink-500 outline-none"
                    onClick={toggleAutoplay}
                    aria-label={isPlaying ? "Mettre le défilement en pause" : "Lancer le défilement"}
                    title={isPlaying ? "Mettre en pause" : "Lecture"}
                >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

            </div>
        </div>
    );
}