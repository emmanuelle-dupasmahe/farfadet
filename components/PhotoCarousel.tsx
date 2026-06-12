"use client";

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoCarouselProps {
    images: { src: string; alt: string; caption?: string }[];
}

export default function PhotoCarousel({ images }: PhotoCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);

    const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    return (
        <div className="relative group max-w-5xl mx-auto my-12 px-4">
            {/* Fenêtre de visualisation */}
            <div className="overflow-hidden rounded-3xl shadow-2xl border-4 border-white" ref={emblaRef}>
                <div className="flex">
                    {images.map((img, index) => (
                        <div className="flex-[0_0_100%] min-w-0 relative h-[300px] md:h-[500px]" key={index}>
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover"
                            />
                            {img.caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                    <p className="text-white font-medium text-lg">{img.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Boutons de navigation (visibles au survol) */}
            <button
                className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full text-pink-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={scrollPrev}
            >
                <ChevronLeft size={24} />
            </button>
            <button
                className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full text-pink-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={scrollNext}
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
}