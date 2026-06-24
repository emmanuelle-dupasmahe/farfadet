"use client";

import React from 'react';

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm px-4 py-2 rounded-xl shadow-sm transition-all"
        >
            🖨️ Imprimer la liste
        </button>
    );
}