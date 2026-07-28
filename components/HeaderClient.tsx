"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';

interface MenuItem {
    id: number;
    label: string;
    url: string | null;
    children: { label: string; url: string | null }[];
}

// Ajout de logoSrc dans les propriétés du composant
interface HeaderClientProps {
    menuItems: MenuItem[];
    logoSrc?: string | null;
}

export default function HeaderClient({ menuItems, logoSrc }: HeaderClientProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    // Si aucun logo n'est défini en base, on utilise l'image locale par défaut
    const currentLogo = logoSrc || "/farfadet.png";

    return (
        <header className="sticky top-0 z-50 w-full bg-pink-600 text-white shadow-md print:hidden">
            <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

                {/* Logo cliquable de l'association */}
                <Link href="/" className="flex items-center gap-4 group" onClick={closeMobileMenu}>
                    <Image
                        src={currentLogo} // Source dynamique issue de la BDD
                        alt="Logo Les Farfadets Vertigo"
                        width={70}
                        height={70}
                        className="object-contain w-auto h-auto max-h-16 transition-transform group-hover:scale-105"
                        priority // Recommandé par Next.js pour le logo du Header (LCP)
                    />
                    <span className="text-xl md:text-2xl font-bold tracking-tight">
                        Les Farfadets Vertigo
                    </span>
                </Link>

                {/* Bouton Hamburger Mobile */}
                <button
                    className="md:hidden p-2 text-white hover:bg-pink-700 rounded-lg transition-colors focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-expanded={isMobileMenuOpen}
                    aria-label="Ouvrir le menu principal"
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* --- NAVIGATION DESKTOP --- */}
                <nav aria-label="Menu principal" className="hidden md:block">
                    <ul className="flex gap-8 font-semibold items-center">
                        {menuItems.map((item) => {
                            if (item.children && item.children.length > 0) {
                                return (
                                    <li key={item.id} className="relative group">
                                        <button className="flex items-center gap-1 hover:text-pink-200 transition-colors py-2 focus:outline-none rounded">
                                            {item.label} <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />
                                        </button>
                                        <div className="absolute left-0 mt-2 w-64 bg-white text-slate-800 rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-all duration-200">
                                            <ul className="p-2 space-y-1">
                                                {item.children.map((child, index) => (
                                                    <li key={index}>
                                                        <Link href={child.url || '#'} className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-600 rounded-lg">
                                                            {child.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </li>
                                );
                            }
                            return (
                                <li key={item.id}>
                                    <Link href={item.url || '/'} className="hover:text-pink-200 transition-colors py-2">
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>

            {/* --- NAVIGATION MOBILE --- */}
            {isMobileMenuOpen && (
                <nav className="md:hidden bg-white text-slate-800 border-t border-pink-500 shadow-xl absolute w-full left-0">
                    <ul className="flex flex-col p-4 space-y-4 max-h-[80vh] overflow-y-auto">
                        {menuItems.map((item) => {
                            if (item.children && item.children.length > 0) {
                                return (
                                    <li key={item.id} className="border-b border-slate-100 pb-2">
                                        <span className="text-pink-600 font-bold mb-2 block">{item.label}</span>
                                        <ul className="space-y-2 pl-4">
                                            {item.children.map((child, index) => (
                                                <li key={index}>
                                                    <Link href={child.url || '#'} onClick={closeMobileMenu} className="block text-slate-600 hover:text-pink-600">
                                                        {child.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                );
                            }
                            return (
                                <li key={item.id} className="border-b border-slate-100 pb-2">
                                    <Link href={item.url || '/'} onClick={closeMobileMenu} className="block text-pink-600 font-bold hover:text-pink-700">
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            )}
        </header>
    );
}