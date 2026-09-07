"use client";

import { useRef, useState } from "react";
import { Tag } from "lucide-react";
// Les imports de heic2any et browser-image-compression ont été retirés d'ici

export default function UploadForm({
    addPhoto,
    pages
}: {
    addPhoto: (formData: FormData) => Promise<void>,
    pages: any[]
}) {
    const formRef = useRef<HTMLFormElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsUploading(true);

        const formData = new FormData(event.currentTarget);
        let file = formData.get("file") as File;

        // 1. Conversion HEIC (iOS)
        const isHeic = file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().match(/\.hei[cf]$/);
        if (isHeic) {
            try {
                // Import dynamique exécuté uniquement dans le navigateur
                const heic2any = (await import("heic2any")).default;

                const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 });
                const blobToUse = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                file = new File([blobToUse], file.name.replace(/\.hei[cf]$/i, ".jpg"), { type: "image/jpeg" });
            } catch (error) {
                alert("Erreur de conversion de l'image.");
                setIsUploading(false);
                return;
            }
        }

        // 2. Compression du poids (Android & iOS)
        try {
            // Import dynamique exécuté uniquement dans le navigateur
            const imageCompression = (await import("browser-image-compression")).default;

            const options = {
                maxSizeMB: 0.8,
                maxWidthOrHeight: 1200,
                useWebWorker: true,
            };
            const compressedFile = await imageCompression(file, options);
            formData.set("file", compressedFile);
        } catch (error) {
            alert("Impossible de compresser l'image avant l'envoi.");
            setIsUploading(false);
            return;
        }

        // 3. Envoi au serveur
        await addPhoto(formData);

        formRef.current?.reset();
        setIsUploading(false);
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Tag size={16} className="text-pink-600" />
                    Activité concernée
                </label>
                <select name="category" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 text-sm bg-white cursor-pointer">
                    {pages.map((p: any) => (
                        <option key={p.slug} value={p.slug}>📌 {p.title}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fichier image</label>
                <input type="file" name="file" accept="image/*,.heic,.heif" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 text-sm bg-slate-50 cursor-pointer" />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description (alt) *</label>
                <input type="text" name="alt" required placeholder="ex: Un jeune grimpeur sourit" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 text-sm" />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Légende sur le carrousel (Optionnelle)</label>
                <input type="text" name="caption" placeholder="ex: Stage d'été multisports" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 text-sm" />
            </div>

            <button type="submit" disabled={isUploading} className={`w-full text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-sm mt-2 ${isUploading ? 'bg-pink-400 cursor-wait' : 'bg-pink-600 hover:bg-pink-700'}`}>
                {isUploading ? "Traitement en cours..." : "Uploader l'image"}
            </button>
        </form>
    );
}