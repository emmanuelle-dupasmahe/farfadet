import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full flex flex-col mt-auto">
            {/* Section des Vagues SVG */}
            <div className="w-full leading-none z-10 -mb-1">
                <svg
                    viewBox="0 0 1440 320"
                    className="w-full block h-24 md:h-48 object-cover object-top"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    {/* Vague Rose (Arrière-plan) */}
                    <path
                        className="fill-pink-600"
                        d="M0,160L48,170.7C96,181,192,203,288,208C384,213,480,203,576,170.7C672,139,768,85,864,85.3C960,85,1056,139,1152,149.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    ></path>
                    {/* Vague Bleue (Premier plan) */}
                    <path
                        className="fill-blue-950"
                        d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    ></path>
                </svg>
            </div>

            {/* Contenu du Footer (Fond Bleu Marine) */}
            <div className="bg-blue-950 text-white pt-8 pb-12 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Bloc 1 : L'association */}
                    <div>
                        <h3 className="text-2xl font-bold text-pink-500 mb-4">Les Farfadets Vertigo</h3>
                        <p className="text-slate-300 leading-relaxed mb-4">
                            Association Multi-sports, sports-adaptés et bien-être. Tous les sports autrement.
                        </p>

                        {/* Les logos partenaires transparents */}
                        <div className="flex gap-6 mt-6 items-center">
                            <a
                                href="https://sportadapte.fr/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block hover:scale-105 transition-transform"
                                aria-label="Visiter le site de la Fédération Française du Sport Adapté"
                            >
                                <Image
                                    src="/Logo-FFSA_Q_HORIZONTAL.png"
                                    alt="Fédération Française du Sport Adapté"
                                    width={150}
                                    height={50}
                                    className="object-contain h-10 w-auto"
                                />
                            </a>
                            <a
                                href="https://www.ufolep.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block hover:scale-105 transition-transform"
                                aria-label="Visiter le site de l'UFOLEP"
                            >
                                <Image
                                    src="/logo_ufolep.png"
                                    alt="UFOLEP"
                                    width={110}
                                    height={50}
                                    className="object-contain h-10 w-auto"
                                />
                            </a>
                        </div>
                    </div>

                    {/* Bloc 2 : Contact (Repris du flyer) */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 border-b border-blue-800 pb-2">Renseignements</h3>
                        <ul className="space-y-3 text-slate-300">
                            <li className="flex items-center gap-3">
                                <Phone className="text-pink-500 w-5 h-5" />
                                <span>
                                    <strong>Sarah :</strong> 06 20 78 49 14
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-pink-500 w-5 h-5" />
                                <span>
                                    <strong>Régis :</strong> 06 62 94 85 06
                                </span>
                            </li>
                            <li className="flex items-center gap-3 mt-4">
                                <Mail className="text-pink-500 w-5 h-5" />
                                <a href="mailto:Lesfarfadetsvertigo@gmail.com" className="hover:text-white transition-colors">
                                    Lesfarfadetsvertigo@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Bloc 3 : Liens légaux & Accessibilité */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 border-b border-blue-800 pb-2">Informations</h3>
                        <ul className="space-y-2 text-slate-300">
                            <li>
                                <Link href="/mentions-legales" className="hover:text-pink-400 transition-colors">
                                    Mentions légales
                                </Link>
                            </li>
                            <li>
                                <Link href="/confidentialite" className="hover:text-pink-400 transition-colors">
                                    Politique de confidentialité
                                </Link>
                            </li>
                            <li>
                                <Link href="/accessibilite" className="hover:text-pink-400 transition-colors">
                                    Déclaration d'accessibilité (RGAA)
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-blue-900 text-center text-slate-400 text-sm">
                    <p>© {new Date().getFullYear()} Les Farfadets Vertigo. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}