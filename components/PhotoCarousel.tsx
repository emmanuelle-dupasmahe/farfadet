"use client";

import React from 'react';
import useEmblaCarousel from 'embla-carousel-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoCarouselProps {
    images: { src: string; alt: string; caption?: string }[];
}

export default function PhotoCarousel({ images }: PhotoCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
    ]);

    const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    return (
        <div className="relative group max-w-3xl mx-auto my-12 px-4">
            <div className="overflow-hidden rounded-3xl shadow-xl border-4 border-white" ref={emblaRef}>
                <div className="flex">
                    {images.map((img, index) => (
                        <div className="flex-[0_0_100%] min-w-0 relative h-[200px] md:h-[350px]" key={index}>
                            {/* Protection : La combinaison de ces classes bloque la sélection et le drag */}
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, 768px"
                                className="object-cover select-none [-webkit-user-drag:none]"
                                draggable={false}
                            />

                            {img.caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10 pointer-events-none">
                                    <p className="text-white font-medium text-base">{img.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Boutons de navigation */}
            <button className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full text-pink-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 outline-none focus:ring-2 focus:ring-pink-500" onClick={scrollPrev} aria-label="Image précédente">
                <ChevronLeft size={20} />
            </button>
            <button className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full text-pink-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 outline-none focus:ring-2 focus:ring-pink-500" onClick={scrollNext} aria-label="Image suivante">
                <ChevronRight size={20} />
            </button>
        </div>
    );
}