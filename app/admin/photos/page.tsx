import React from 'react';
import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Trash2, PlusCircle, Image as ImageIcon, Tag } from 'lucide-react';
import Image from 'next/image';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export default async function AdminPhotosPage() {
  // 1. Récupérer toutes les photos
  const [rows] = await pool.query('SELECT * FROM photos ORDER BY id DESC') as any;

  // EXTRA : Récupérer dynamiquement toutes les pages pour le menu déroulant
  const [pages] = await pool.query('SELECT slug, title FROM custom_pages ORDER BY title ASC') as any;

  // 2. Action du serveur pour ajouter une photo
  async function addPhoto(formData: FormData) {
    'use server';

    const file = formData.get('file') as File;
    const alt = formData.get('alt') as string;
    const caption = formData.get('caption') as string;
    const category = formData.get('category') as string;

    if (!file || file.size === 0 || !alt || !category) return;

    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    await fs.mkdir(uploadDir, { recursive: true });

    const filepath = path.join(uploadDir, uniqueFilename);
    await fs.writeFile(filepath, buffer);

    const src = `/uploads/${uniqueFilename}`;

    await pool.query(
      'INSERT INTO photos (src, alt, caption, category) VALUES (?, ?, ?, ?)',
      [src, alt, caption || null, category]
    );

    revalidatePath('/admin/photos');
    revalidatePath(`/${category}`);
  }

  // 3. Action du serveur pour supprimer une photo
  async function deletePhoto(formData: FormData) {
    'use server';

    const id = formData.get('id');
    const src = formData.get('src') as string;
    const category = formData.get('category') as string;

    if (!id) return;

    await pool.query('DELETE FROM photos WHERE id = ?', [id]);

    if (src && src.startsWith('/uploads/')) {
      try {
        const filepath = path.join(process.cwd(), 'public', src);
        await fs.unlink(filepath);
      } catch (error) {
        console.error("Erreur lors de la suppression du fichier:", error);
      }
    }

    revalidatePath('/admin/photos');
    if (category) revalidatePath(`/${category}`);
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-pink-600 p-2 rounded-xl text-white">
          <ImageIcon size={28} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Gestion des Photos</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Formulaire d'ajout */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <PlusCircle size={20} className="text-pink-600" />
            Ajouter une photo
          </h2>

          <form action={addPhoto} className="space-y-4">

            {/* Menu déroulant DYNAMIQUE rattaché aux pages réelles */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Tag size={16} className="text-pink-600" />
                Activité concernée
              </label>
              <select
                name="category"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 text-sm bg-white cursor-pointer"
              >
                {pages.map((p: any) => (
                  <option key={p.slug} value={p.slug}>
                    📌 {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Fichier image
              </label>
              <input
                type="file"
                name="file"
                accept="image/*"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 text-sm bg-slate-50 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description (alt) <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                name="alt"
                required
                placeholder="ex: Un jeune grimpeur sourit"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Légende sur le carrousel (Optionnelle)
              </label>
              <input
                type="text"
                name="caption"
                placeholder="ex: Stage d'été multisports"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-sm mt-2"
            >
              Uploader l'image
            </button>
          </form>
        </div>

        {/* Liste des photos */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Photos actuellement en ligne ({rows.length})</h2>

          {rows.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-slate-500">
              Aucune photo n'a encore été ajoutée.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rows.map((photo: any) => (
                <div key={photo.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">

                  <div className="relative h-44 w-full bg-slate-100">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-slate-800 uppercase shadow-sm border border-white/50">
                      {photo.category}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-800 truncate">{photo.alt}</h3>
                      {photo.caption && (
                        <p className="text-xs text-slate-500 mt-1 italic">« {photo.caption} »</p>
                      )}
                    </div>

                    <form action={deletePhoto} className="border-t border-slate-100 pt-3 flex justify-end">
                      <input type="hidden" name="id" value={photo.id} />
                      <input type="hidden" name="src" value={photo.src} />
                      <input type="hidden" name="category" value={photo.category} />
                      <button
                        type="submit"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                      >
                        <Trash2 size={14} /> Supprimer
                      </button>
                    </form>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}