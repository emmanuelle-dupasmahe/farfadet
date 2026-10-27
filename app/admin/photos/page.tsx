import React from 'react';
import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Trash2, PlusCircle, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import UploadForm from '@/components/admin/UploadForm';
import Link from 'next/link'; // Import requis pour la pagination

export const dynamic = 'force-dynamic';

export default async function AdminPhotosPage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  // 1. GESTION DE LA PAGINATION
  const params = await props.searchParams;
  const currentPage = Number(params?.page) || 1;
  const itemsPerPage = 10; // Tu peux modifier ce nombre
  const offset = (currentPage - 1) * itemsPerPage;

  // Récupérer le nombre total de photos pour calculer le nombre de pages
  const [countResult] = await pool.query('SELECT COUNT(*) as count FROM photos') as any;
  const totalPhotos = countResult[0].count;
  const totalPages = Math.ceil(totalPhotos / itemsPerPage);

  // Récupérer uniquement les photos de la page courante
  const [rows] = await pool.query(
    'SELECT * FROM photos ORDER BY id DESC LIMIT ? OFFSET ?',
    [itemsPerPage, offset]
  ) as any;

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
    const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '').split('.')[0]}.webp`;
    const uploadDir = path.join(/* turbopackIgnore: true */ process.cwd(), 'uploads');

    await fs.mkdir(uploadDir, { recursive: true });
    const filepath = path.join(uploadDir, uniqueFilename);

    await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filepath);

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
        const filepath = path.join(/* turbopackIgnore: true */ process.cwd(), src.startsWith('/') ? src.slice(1) : src);
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
          <UploadForm addPhoto={addPhoto} pages={pages} />
        </div>

        {/* Liste des photos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Photos en ligne ({totalPhotos} au total)</h2>
            <span className="bg-slate-100 text-slate-600 py-1 px-3 rounded-full text-sm font-semibold">
              Page {currentPage} / {totalPages || 1}
            </span>
          </div>

          {rows.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-slate-500">
              Aucune photo sur cette page.
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
                      unoptimized
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

          {/* CONTRÔLES DE PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8 pt-4">
              {currentPage > 1 ? (
                <Link
                  href={`/admin/photos?page=${currentPage - 1}`}
                  className="flex items-center gap-1 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 hover:text-pink-600 transition-colors font-medium text-sm shadow-sm"
                >
                  <ChevronLeft size={16} /> Précédent
                </Link>
              ) : (
                <span className="flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-400 px-4 py-2 rounded-lg cursor-not-allowed font-medium text-sm">
                  <ChevronLeft size={16} /> Précédent
                </span>
              )}

              <span className="text-sm font-bold text-slate-600">
                {currentPage} sur {totalPages}
              </span>

              {currentPage < totalPages ? (
                <Link
                  href={`/admin/photos?page=${currentPage + 1}`}
                  className="flex items-center gap-1 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 hover:text-pink-600 transition-colors font-medium text-sm shadow-sm"
                >
                  Suivant <ChevronRight size={16} />
                </Link>
              ) : (
                <span className="flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-400 px-4 py-2 rounded-lg cursor-not-allowed font-medium text-sm">
                  Suivant <ChevronRight size={16} />
                </span>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}