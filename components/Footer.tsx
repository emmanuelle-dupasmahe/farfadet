import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail } from 'lucide-react';
import pool from '@/lib/db';

const FacebookIcon = ({ size = 20 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
);

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
    </svg>
);

export default async function Footer() {
    let settings = null;
    try {
        const [rows] = await pool.query('SELECT * FROM site_settings WHERE id = 1') as any;
        if (rows.length > 0) {
            settings = rows[0];
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des paramètres du site :", error);
    }

    const mainPhone = settings?.phone || "06 20 78 49 14";
    const regisPhone = settings?.phone_regis || "06 62 94 85 06";
    const mainEmail = settings?.email || "Lesfarfadetsvertigo@gmail.com";
    const copyright = settings?.copyright_text || `© ${new Date().getFullYear()} Les Farfadets Vertigo. Tous droits réservés.`;
    const footerDescription = settings?.footer_description || "Association Multi-sports, sports-adaptés et bien-être. Tous les sports autrement.";
    const ffsaUrl = settings?.partner_ffsa_url || "https://sportadapte.fr/";
    const ufolepUrl = settings?.partner_ufolep_url || "https://www.ufolep.org/";
    // Récupérer les chemins ou utiliser les fallbacks par défaut
    const ffsaLogo = settings?.partner_ffsa_logo || "/Logo-FFSA_Q_HORIZONTAL.png";
    const ufolepLogo = settings?.partner_ufolep_logo || "/logo_ufolep.png";

    return (
        <footer className="w-full flex flex-col mt-auto">
            <div className="w-full leading-none z-10 -mb-1">
                <svg viewBox="0 0 1440 320" className="w-full block h-24 md:h-48 object-cover object-top" preserveAspectRatio="none" aria-hidden="true">
                    <path className="fill-pink-600" d="M0,160L48,170.7C96,181,192,203,288,208C384,213,480,203,576,170.7C672,139,768,85,864,85.3C960,85,1056,139,1152,149.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    <path className="fill-blue-950" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>

            <div className="bg-blue-950 text-white pt-8 pb-12 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <h3 className="text-2xl font-bold text-pink-500 mb-4">Les Farfadets Vertigo</h3>
                        {/* Description dynamique */}
                        <p className="text-slate-300 leading-relaxed mb-4">{footerDescription}</p>

                        <div className="flex gap-4 mb-6">
                            {settings?.facebook_url && settings.facebook_url !== '#' && (
                                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="bg-blue-900/50 p-2 rounded-full hover:bg-pink-600 transition-colors">
                                    <FacebookIcon size={20} />
                                </a>
                            )}
                            {settings?.instagram_url && settings.instagram_url !== '#' && (
                                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="bg-blue-900/50 p-2 rounded-full hover:bg-pink-600 transition-colors">
                                    <InstagramIcon size={20} />
                                </a>
                            )}
                        </div>

                        <div className="flex gap-6 items-center">
                            {/* Lien et Logo FFSA dynamiques */}
                            <a href={ffsaUrl} target="_blank" rel="noopener noreferrer" className="block hover:scale-105 transition-transform">
                                <Image src={ffsaLogo} alt="Fédération Française du Sport Adapté" width={150} height={50} className="object-contain h-10 w-auto" />
                            </a>
                            {/* Lien et Logo UFOLEP dynamiques */}
                            <a href={ufolepUrl} target="_blank" rel="noopener noreferrer" className="block hover:scale-105 transition-transform">
                                <Image src={ufolepLogo} alt="UFOLEP" width={110} height={50} className="object-contain h-10 w-auto" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4 border-b border-blue-800 pb-2">Renseignements</h3>
                        <ul className="space-y-3 text-slate-300">
                            <li className="flex items-center gap-3">
                                <Phone className="text-pink-500 w-5 h-5 shrink-0" />
                                <span><strong>Sarah :</strong> <a href={`tel:${mainPhone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{mainPhone}</a></span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-pink-500 w-5 h-5 shrink-0" />
                                <span><strong>Régis :</strong> <a href={`tel:${regisPhone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{regisPhone}</a></span>
                            </li>
                            <li className="flex items-center gap-3 mt-4">
                                <Mail className="text-pink-500 w-5 h-5 shrink-0" />
                                <a href={`mailto:${mainEmail}`} className="hover:text-white transition-colors break-all">{mainEmail}</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4 border-b border-blue-800 pb-2">Informations</h3>
                        <ul className="space-y-2 text-slate-300">
                            <li><Link href="/mentions-legales" className="hover:text-pink-400 transition-colors">Mentions légales</Link></li>
                            <li><Link href="/confidentialite" className="hover:text-pink-400 transition-colors">Politique de confidentialité</Link></li>
                            <li><Link href="/accessibilite" className="hover:text-pink-400 transition-colors">Déclaration d'accessibilité (RGAA)</Link></li>
                        </ul>
                    </div>
                </div>

                {/* --- ZONE MODIFIÉE POUR LE LIEN ADMIN DISCRET --- */}
                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-blue-900 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
                    <p>{copyright}</p>

                    <Link
                        href="/admin"
                        className="text-slate-500 hover:text-pink-500 transition-colors"
                        title="Espace administration"
                    >
                        Accès Équipe
                    </Link>
                </div>
                {/* ------------------------------------------------ */}
            </div>
        </footer>
    );
}