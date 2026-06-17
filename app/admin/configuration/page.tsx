import React from 'react';
import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Settings, Save, Phone, FileText, ShieldAlert, CheckCircle, UploadCloud } from 'lucide-react';
import { promises as fs } from 'fs';
import path from 'path';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage(props: {
    searchParams: Promise<{ tab?: string; success?: string }>
}) {
    const searchParams = await props.searchParams;
    const activeTab = searchParams?.tab || 'coordonnees';
    const isSuccess = searchParams?.success === 'true';

    // 1. Récupération de la configuration globale
    const [rows] = await pool.query('SELECT * FROM site_settings WHERE id = 1') as any;
    const settings = rows[0] || {};

    // 2. Action Serveur : Sauvegarde de l'onglet Coordonnées & Logos
    async function updateSettings(formData: FormData) {
        'use server';

        const phone = formData.get('phone') as string;
        const phone_regis = formData.get('phone_regis') as string;
        const email = formData.get('email') as string;
        const facebook_url = formData.get('facebook_url') as string;
        const instagram_url = formData.get('instagram_url') as string;
        const copyright_text = formData.get('copyright_text') as string;
        const footer_description = formData.get('footer_description') as string;
        const partner_ffsa_url = formData.get('partner_ffsa_url') as string;
        const partner_ufolep_url = formData.get('partner_ufolep_url') as string;

        // Récupération des fichiers logos (Nouveau : assocFile)
        const assocFile = formData.get('assoc_logo_file') as File;
        const ffsaFile = formData.get('ffsa_logo_file') as File;
        const ufolepFile = formData.get('ufolep_logo_file') as File;

        // Récupération des anciens chemins (Nouveau : assocLogoPath)
        let assocLogoPath = formData.get('current_assoc_logo') as string;
        let ffsaLogoPath = formData.get('current_ffsa_logo') as string;
        let ufolepLogoPath = formData.get('current_ufolep_logo') as string;

        const uploadDir = path.join(process.cwd(), 'public/uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        // Traitement du logo de l'Association
        if (assocFile && assocFile.size > 0) {
            const buffer = Buffer.from(await assocFile.arrayBuffer());
            const filename = `logo-assoc-${Date.now()}-${assocFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            await fs.writeFile(path.join(uploadDir, filename), buffer);
            assocLogoPath = `/uploads/${filename}`;
        }

        // Traitement du logo FFSA
        if (ffsaFile && ffsaFile.size > 0) {
            const buffer = Buffer.from(await ffsaFile.arrayBuffer());
            const filename = `logo-ffsa-${Date.now()}-${ffsaFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            await fs.writeFile(path.join(uploadDir, filename), buffer);
            ffsaLogoPath = `/uploads/${filename}`;
        }

        // Traitement du logo UFOLEP
        if (ufolepFile && ufolepFile.size > 0) {
            const buffer = Buffer.from(await ufolepFile.arrayBuffer());
            const filename = `logo-ufolep-${Date.now()}-${ufolepFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            await fs.writeFile(path.join(uploadDir, filename), buffer);
            ufolepLogoPath = `/uploads/${filename}`;
        }

        // Requête SQL mise à jour avec association_logo
        await pool.query(
            `UPDATE site_settings SET 
                phone = ?, phone_regis = ?, email = ?, facebook_url = ?, instagram_url = ?, 
                copyright_text = ?, footer_description = ?, partner_ffsa_url = ?, partner_ufolep_url = ?,
                association_logo = ?, partner_ffsa_logo = ?, partner_ufolep_logo = ? 
            WHERE id = 1`,
            [
                phone, phone_regis, email, facebook_url, instagram_url,
                copyright_text, footer_description, partner_ffsa_url, partner_ufolep_url,
                assocLogoPath, ffsaLogoPath, ufolepLogoPath
            ]
        );

        revalidatePath('/', 'layout');
        redirect('/admin/configuration?tab=coordonnees&success=true');
    }

    // 3. Action Serveur : Sauvegarde de l'onglet Pages Légales
    async function updatePagesLegales(formData: FormData) {
        'use server';

        const mentions = formData.get('mentions_legales') as string;
        const confidentialite = formData.get('politique_confidentialite') as string;
        const accessibilite = formData.get('declaration_accessibilite') as string;

        await pool.query(
            `UPDATE site_settings SET 
                mentions_legales = ?, 
                politique_confidentialite = ?, 
                declaration_accessibilite = ? 
            WHERE id = 1`,
            [mentions, confidentialite, accessibilite]
        );

        revalidatePath('/mentions-legales');
        revalidatePath('/confidentialite');
        revalidatePath('/accessibilite');
        redirect('/admin/configuration?tab=legales&success=true');
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Titre principal */}
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-950 p-2 rounded-xl text-pink-500">
                    <Settings size={28} />
                </div>
                <h1 className="text-3xl font-bold text-slate-800">Configuration générale du site</h1>
            </div>

            {/* Notification de succès */}
            {isSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 mb-6 text-sm font-medium animate-fade-in">
                    <CheckCircle size={18} className="text-emerald-600" />
                    Les modifications ont été enregistrées avec succès et le site a été mis à jour !
                </div>
            )}

            {/* Menu d'onglets (Tabs) */}
            <div className="flex gap-6 border-b border-slate-200 mb-8">
                <a
                    href="/admin/configuration?tab=coordonnees"
                    className={`pb-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'coordonnees' ? 'border-pink-600 text-pink-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    <Phone size={18} /> Coordonnées & Coordonnées
                </a>
                <a
                    href="/admin/configuration?tab=legales"
                    className={`pb-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'legales' ? 'border-pink-600 text-pink-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    <FileText size={18} /> Pages Légales & RGPD
                </a>
            </div>

            {/* --- CONTENU ONGLET 1 : COORDONNÉES ET LOGOS --- */}
            {activeTab === 'coordonnees' && (
                <form action={updateSettings} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    {/* Sécurité : conserve l'ancien logo si pas de modification */}
                    <input type="hidden" name="current_assoc_logo" value={settings?.association_logo || ''} />
                    <input type="hidden" name="current_ffsa_logo" value={settings?.partner_ffsa_logo || '/Logo-FFSA_Q_HORIZONTAL.png'} />
                    <input type="hidden" name="current_ufolep_logo" value={settings?.partner_ufolep_logo || '/logo_ufolep.png'} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone de Sarah</label>
                            <input type="text" name="phone" defaultValue={settings?.phone || ''} className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone de Régis</label>
                            <input type="text" name="phone_regis" defaultValue={settings?.phone_regis || ''} className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email de contact</label>
                            <input type="email" name="email" defaultValue={settings?.email || ''} className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Lien Facebook</label>
                            <input type="text" name="facebook_url" defaultValue={settings?.facebook_url || ''} className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Lien Instagram</label>
                            <input type="text" name="instagram_url" defaultValue={settings?.instagram_url || ''} className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800" />
                        </div>
                    </div>

                    <div className="border-t pt-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Texte de présentation (Footer)</label>
                            <textarea name="footer_description" rows={3} defaultValue={settings?.footer_description || ''} className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800" />
                        </div>

                        {/* TROISIÈME BLOC : LOGO PRINCIPAL ASSOCIATION */}
                        <div className="p-4 bg-pink-50/40 rounded-xl border border-pink-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col justify-center">
                                <span className="text-sm font-bold text-pink-950 flex items-center gap-1.5 mb-1">
                                    <UploadCloud size={16} className="text-pink-600" /> Logo de l'Association
                                </span>
                                <span className="text-xs text-slate-500">Ce logo sera utilisé principalement dans la barre de navigation et la page d'accueil du site.</span>
                            </div>
                            <div className="flex items-center">
                                <input type="file" name="assoc_logo_file" accept="image/*" className="w-full px-3 py-1.5 border rounded-lg text-sm bg-white cursor-pointer text-slate-800" />
                            </div>
                        </div>

                        {/* Section FFSA */}
                        <div className="p-4 bg-slate-50 rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Lien Partenaire FFSA</label>
                                <input type="text" name="partner_ffsa_url" defaultValue={settings?.partner_ffsa_url || ''} className="w-full px-3 py-2 border rounded-lg text-sm bg-white text-slate-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Changer le Logo FFSA</label>
                                <input type="file" name="ffsa_logo_file" accept="image/*" className="w-full px-3 py-1.5 border rounded-lg text-sm bg-white cursor-pointer text-slate-800" />
                            </div>
                        </div>

                        {/* Section UFOLEP */}
                        <div className="p-4 bg-slate-50 rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Lien Partenaire UFOLEP</label>
                                <input type="text" name="partner_ufolep_url" defaultValue={settings?.partner_ufolep_url || ''} className="w-full px-3 py-2 border rounded-lg text-sm bg-white text-slate-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Changer le Logo UFOLEP</label>
                                <input type="file" name="ufolep_logo_file" accept="image/*" className="w-full px-3 py-1.5 border rounded-lg text-sm bg-white cursor-pointer text-slate-800" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Texte du Pied de Page (Copyright)</label>
                            <input type="text" name="copyright_text" defaultValue={settings?.copyright_text || ''} className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800" />
                        </div>
                    </div>

                    <button type="submit" className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors shadow-sm ml-auto">
                        <Save size={18} /> Sauvegarder la configuration
                    </button>
                </form>
            )}

            {/* --- CONTENU ONGLET 2 : TEXTES JURIDIQUES ET PAGES LÉGALES --- */}
            {activeTab === 'legales' && (
                <form action={updatePagesLegales} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 mb-1">Contenus réglementaires obligatoires</h2>
                        <p className="text-xs text-slate-500">Rédigez ici les contenus textuels de vos pages légales.</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                                <FileText size={16} className="text-pink-600" /> Mentions Légales
                            </label>
                            <textarea
                                name="mentions_legales"
                                rows={8}
                                defaultValue={settings?.mentions_legales || ''}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-slate-50 focus:bg-white text-slate-800 transition-colors"
                                placeholder="Indiquez l'éditeur, le bureau de l'association, l'hébergement..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                                <ShieldAlert size={16} className="text-pink-600" /> Politique de Confidentialité (RGPD)
                            </label>
                            <textarea
                                name="politique_confidentialite"
                                rows={8}
                                defaultValue={settings?.politique_confidentialite || ''}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-slate-50 focus:bg-white text-slate-800 transition-colors"
                                placeholder="Détaillez la protection des données (cookies d'admin, formulaires HelloAsso...)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                                <FileText size={16} className="text-pink-600" /> Déclaration d'Accessibilité (RGAA)
                            </label>
                            <textarea
                                name="declaration_accessibilite"
                                rows={8}
                                defaultValue={settings?.declaration_accessibilite || ''}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-slate-50 focus:bg-white text-slate-800 transition-colors"
                                placeholder="Indiquez l'état de conformité, vos optimisations (ex: pause des carrousels au survol)..."
                            />
                        </div>
                    </div>

                    <button type="submit" className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors shadow-sm ml-auto">
                        <Save size={18} /> Mettre à jour les textes légaux
                    </button>
                </form>
            )}
        </div>
    );
}