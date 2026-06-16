"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function PageCarousel({ images }: { images: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="relative w-full h-[300px] md:h-[450px] rounded-2xl overflow-hidden group shadow-sm mb-8 bg-slate-100">
            <Image
                src={images[currentIndex]}
                alt={`Illustration ${currentIndex + 1}`}
                fill
                className="object-cover transition-all duration-500"
                priority
            />

            {/* Flèches de navigation (uniquement s'il y a plusieurs images) */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-xs"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-xs"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Indicateurs (petits points en bas) */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-xs">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-pink-500 w-4' : 'bg-white/60'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}