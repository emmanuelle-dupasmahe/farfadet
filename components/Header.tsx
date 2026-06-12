"use client"; // Indispensable car on utilise un état (useState) pour ouvrir/fermer le menu

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react'; // Ajout des icônes Menu et X

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Fonction pour fermer le menu mobile quand on clique sur un lien
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-pink-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

                {/* Le Logo cliquable */}
                <Link href="/" className="flex items-center gap-4 group" onClick={closeMobileMenu}>
                    <Image
                        src="/logo_farfadet.png"
                        alt="Logo Les Farfadets Vertigo"
                        width={70}
                        height={70}
                        className="object-contain w-auto h-auto max-h-16 transition-transform group-hover:scale-105"
                    />
                    <span className="text-xl md:text-2xl font-bold tracking-tight">
                        Les Farfadets Vertigo
                    </span>
                </Link>

                {/* Bouton Hamburger pour Mobile (Visible uniquement sur petits écrans) */}
                <button
                    className="md:hidden p-2 text-white hover:bg-pink-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-expanded={isMobileMenuOpen}
                    aria-label="Ouvrir le menu principal"
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* --- NAVIGATION DESKTOP (Cachée sur mobile) --- */}
                <nav aria-label="Menu principal" className="hidden md:block">
                    <ul className="flex gap-8 font-semibold items-center">

                        {/* Menu Déroulant 1 : Enfants */}
                        <li className="relative group">
                            <button className="flex items-center gap-1 hover:text-pink-200 transition-colors py-2 focus:outline-none rounded">
                                Enfants & Séjours <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />
                            </button>
                            <div className="absolute left-0 mt-2 w-64 bg-white text-slate-800 rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-all duration-200">
                                <ul className="p-2 space-y-1">
                                    <li><Link href="#programme-scolaire" className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-600 rounded-lg">Programme Scolaire</Link></li>
                                    <li><Link href="#sejours-theme" className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-600 rounded-lg">Séjours à thème</Link></li>
                                    <li><Link href="#stage-multisports" className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-600 rounded-lg">Stages Multi-sports</Link></li>
                                </ul>
                            </div>
                        </li>

                        {/* Menu Déroulant 2 : Sports */}
                        <li className="relative group">
                            <button className="flex items-center gap-1 hover:text-pink-200 transition-colors py-2 focus:outline-none rounded">
                                Sports <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />
                            </button>
                            <div className="absolute left-0 mt-2 w-56 bg-white text-slate-800 rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-all duration-200">
                                <ul className="p-2 space-y-1">
                                    <li><Link href="/escalade" className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-600 rounded-lg">Escalade</Link></li>
                                    <li><Link href="#kayak" className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-600 rounded-lg">Kayak & Paddle</Link></li>
                                    <li><Link href="#velo" className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-600 rounded-lg">Vélo & SRAV</Link></li>
                                    <li><Link href="#tir" className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-600 rounded-lg">Tir à l'arc</Link></li>
                                    <li><Link href="#rando" className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-600 rounded-lg">Randonnées</Link></li>
                                </ul>
                            </div>
                        </li>

                        {/* Menu Déroulant 3 : Bien-être */}
                        <li className="relative group">
                            <button className="flex items-center gap-1 hover:text-pink-200 transition-colors py-2 focus:outline-none rounded">
                                Secourisme & Bien-être <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />
                            </button>
                            <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-all duration-200">
                                <ul className="p-2 space-y-1">
                                    <li><Link href="#secourisme" className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-600 rounded-lg">Formations Secourisme</Link></li>
                                    <li><Link href="#renforcement" className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-600 rounded-lg">Renforcement & Stretching</Link></li>
                                    <li><Link href="#massages" className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-600 rounded-lg">Massages Bien-être</Link></li>
                                    <li><Link href="#inclusion" className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-600 rounded-lg border-t border-slate-100 mt-1 pt-2">Handicap & Inclusion</Link></li>
                                </ul>
                            </div>
                        </li>

                    </ul>
                </nav>
            </div>

            {/* --- NAVIGATION MOBILE (Visible uniquement quand isMobileMenuOpen est true) --- */}
            {isMobileMenuOpen && (
                <nav className="md:hidden bg-white text-slate-800 border-t border-pink-500 shadow-xl absolute w-full left-0">
                    <ul className="flex flex-col p-4 space-y-4 max-h-[80vh] overflow-y-auto">

                        {/* Section Enfants */}
                        <li className="border-b border-slate-100 pb-2">
                            <span className="text-pink-600 font-bold mb-2 block">Enfants & Séjours</span>
                            <ul className="space-y-2 pl-4">
                                <li><Link href="#programme-scolaire" onClick={closeMobileMenu} className="block text-slate-600 hover:text-pink-600">Programme Scolaire</Link></li>
                                <li><Link href="#sejours-theme" onClick={closeMobileMenu} className="block text-slate-600 hover:text-pink-600">Séjours à thème</Link></li>
                                <li><Link href="#stage-multisports" onClick={closeMobileMenu} className="block text-slate-600 hover:text-pink-600">Stages Multi-sports</Link></li>
                            </ul>
                        </li>

                        {/* Section Sports */}
                        <li className="border-b border-slate-100 pb-2">
                            <span className="text-pink-600 font-bold mb-2 block">Sports</span>
                            <ul className="space-y-2 pl-4">
                                <li><Link href="#escalade" onClick={closeMobileMenu} className="block text-slate-600 hover:text-pink-600">Escalade</Link></li>
                                <li><Link href="#kayak" onClick={closeMobileMenu} className="block text-slate-600 hover:text-pink-600">Kayak & Paddle</Link></li>
                                <li><Link href="#velo" onClick={closeMobileMenu} className="block text-slate-600 hover:text-pink-600">Vélo & SRAV</Link></li>
                                <li><Link href="#tir" onClick={closeMobileMenu} className="block text-slate-600 hover:text-pink-600">Tir à l'arc</Link></li>
                                <li><Link href="#rando" onClick={closeMobileMenu} className="block text-slate-600 hover:text-pink-600">Randonnées</Link></li>
                            </ul>
                        </li>

                        {/* Section Bien-être */}
                        <li className="pb-2">
                            <span className="text-pink-600 font-bold mb-2 block">Secourisme & Bien-être</span>
                            <ul className="space-y-2 pl-4">
                                <li><Link href="#secourisme" onClick={closeMobileMenu} className="block text-slate-600 hover:text-pink-600">Formations Secourisme</Link></li>
                                <li><Link href="#renforcement" onClick={closeMobileMenu} className="block text-slate-600 hover:text-pink-600">Renforcement & Stretching</Link></li>
                                <li><Link href="#massages" onClick={closeMobileMenu} className="block text-slate-600 hover:text-pink-600">Massages Bien-être</Link></li>
                                <li><Link href="#inclusion" onClick={closeMobileMenu} className="block text-slate-600 hover:text-pink-600">Handicap & Inclusion</Link></li>
                            </ul>
                        </li>

                    </ul>
                </nav>
            )}
        </header>
    );
}