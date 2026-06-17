import React from 'react';
import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Settings, Save } from 'lucide-react';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
    const [rows] = await pool.query('SELECT * FROM site_settings WHERE id = 1') as any;
    const settings = rows[0];

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

        // Récupération des fichiers logos
        const ffsaFile = formData.get('ffsa_logo_file') as File;
        const ufolepFile = formData.get('ufolep_logo_file') as File;

        // Récupération des anciens chemins (au cas où aucun nouveau fichier n'est envoyé)
        let ffsaLogoPath = formData.get('current_ffsa_logo') as string;
        let ufolepLogoPath = formData.get('current_ufolep_logo') as string;

        const uploadDir = path.join(process.cwd(), 'public/uploads');
        await fs.mkdir(uploadDir, { recursive: true });

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

        await pool.query(
            `UPDATE site_settings SET 
        phone = ?, phone_regis = ?, email = ?, facebook_url = ?, instagram_url = ?, 
        copyright_text = ?, footer_description = ?, partner_ffsa_url = ?, partner_ufolep_url = ?,
        partner_ffsa_logo = ?, partner_ufolep_logo = ? 
      WHERE id = 1`,
            [
                phone, phone_regis, email, facebook_url, instagram_url,
                copyright_text, footer_description, partner_ffsa_url, partner_ufolep_url,
                ffsaLogoPath, ufolepLogoPath
            ]
        );

        revalidatePath('/', 'layout');
    }

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                    <Settings size={28} />
                </div>
                <h1 className="text-3xl font-bold text-slate-800">Gestion Footer</h1>
            </div>

            <form action={updateSettings} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                {/* Champs cachés pour conserver les anciens logos si on n'en uploade pas de nouveaux */}
                <input type="hidden" name="current_ffsa_logo" value={settings?.partner_ffsa_logo || '/Logo-FFSA_Q_HORIZONTAL.png'} />
                <input type="hidden" name="current_ufolep_logo" value={settings?.partner_ufolep_logo || '/logo_ufolep.png'} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone de Sarah</label>
                        <input type="text" name="phone" defaultValue={settings?.phone || ''} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone de Régis</label>
                        <input type="text" name="phone_regis" defaultValue={settings?.phone_regis || ''} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email de contact</label>
                        <input type="email" name="email" defaultValue={settings?.email || ''} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Lien Facebook</label>
                        <input type="text" name="facebook_url" defaultValue={settings?.facebook_url || ''} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Lien Instagram</label>
                        <input type="text" name="instagram_url" defaultValue={settings?.instagram_url || ''} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Texte de présentation (Footer)</label>
                        <textarea name="footer_description" rows={3} defaultValue={settings?.footer_description || ''} className="w-full px-3 py-2 border rounded-lg text-sm resize-none" />
                    </div>

                    {/* Section FFSA */}
                    <div className="p-4 bg-slate-50 rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Lien Partenaire FFSA</label>
                            <input type="text" name="partner_ffsa_url" defaultValue={settings?.partner_ffsa_url || ''} className="w-full px-3 py-2 border rounded-lg text-sm bg-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Changer le Logo FFSA</label>
                            <input type="file" name="ffsa_logo_file" accept="image/*" className="w-full px-3 py-1.5 border rounded-lg text-sm bg-white cursor-pointer" />
                        </div>
                    </div>

                    {/* Section UFOLEP */}
                    <div className="p-4 bg-slate-50 rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Lien Partenaire UFOLEP</label>
                            <input type="text" name="partner_ufolep_url" defaultValue={settings?.partner_ufolep_url || ''} className="w-full px-3 py-2 border rounded-lg text-sm bg-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Changer le Logo UFOLEP</label>
                            <input type="file" name="ufolep_logo_file" accept="image/*" className="w-full px-3 py-1.5 border rounded-lg text-sm bg-white cursor-pointer" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Texte du Pied de Page (Copyright)</label>
                        <input type="text" name="copyright_text" defaultValue={settings?.copyright_text || ''} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                </div>

                <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">
                    <Save size={18} /> Sauvegarder la configuration
                </button>
            </form>
        </div>
    );
}