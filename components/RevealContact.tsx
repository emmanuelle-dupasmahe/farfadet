// components/RevealContact.tsx
"use client";

import React, { useState } from 'react';

interface Props {
    value: string;
    type: 'phone' | 'email';
}

export default function RevealContact({ value, type }: Props) {
    const [isRevealed, setIsRevealed] = useState(false);

    if (!isRevealed) {
        return (
            <button
                onClick={() => setIsRevealed(true)}
                className="text-xs bg-blue-900/50 text-pink-400 hover:text-white hover:bg-pink-600 px-3 py-1 rounded-md transition-colors ml-1"
            >
                Afficher {type === 'phone' ? 'le numéro' : "l'adresse"}
            </button>
        );
    }

    const href = type === 'phone' ? `tel:${value.replace(/\s/g, '')}` : `mailto:${value}`;

    return (
        <a href={href} className="hover:text-white transition-colors ml-1 break-all">
            {value}
        </a>
    );
}