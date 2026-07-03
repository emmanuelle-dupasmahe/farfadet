"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function PageCarousel({ images }: { images: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false); // Pour mettre en pause au survol (RGAA)

    // Défilement automatique avec gestion du survol
    useEffect(() => {
        if (!images || images.length <= 1 || isHovered) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 4000); // Défilement toutes les 4 secondes

        return () => clearInterval(interval);
    }, [images, isHovered]);

    if (!images || images.length === 0) return null;

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        /* MODIFICATION TAILLE : max-w-3xl pour le rendre plus étroit, et hauteurs réduites */
        <div
            className="relative w-full max-w-3xl mx-auto h-[220px] md:h-[350px] rounded-3xl overflow-hidden group shadow-md mb-8 bg-slate-100 border-4 border-white"
            onMouseEnter={() => setIsHovered(true)}  // Pause quand la souris entre
            onMouseLeave={() => setIsHovered(false)} // Reprise quand la souris sort
            onContextMenu={(e) => e.preventDefault()} // Empêche le menu contextuel (clic droit)
        >
            <Image
                src={images[currentIndex]}
                alt={`Illustration ${currentIndex + 1}`}
                fill
                className="object-cover transition-all duration-500 select-none [-webkit-user-drag:none]"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
                draggable={false}
            />

            {/* Couche de protection transparente */}
            <div className="absolute inset-0 z-10 pointer-events-none"></div>

            {/* Flèches de navigation (uniquement s'il y a plusieurs images) */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-xs outline-none focus:opacity-100 focus:ring-2 focus:ring-pink-500"
                        aria-label="Image précédente"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-xs outline-none focus:opacity-100 focus:ring-2 focus:ring-pink-500"
                        aria-label="Image suivante"
                    >
                        <ChevronRight size={20} />
                    </button>

                    {/* Indicateurs (petits points en bas) */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-xs">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-pink-500 w-4' : 'bg-white/60'}`}
                                aria-label={`Aller à l'image ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}