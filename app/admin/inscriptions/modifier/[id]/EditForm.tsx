'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditForm({ inscription }: { inscription: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // Initialisation du formulaire avec les données existantes
    const [formData, setFormData] = useState({
        first_name: inscription.first_name,
        last_name: inscription.last_name,
        email: inscription.email,
        phone: inscription.phone,
        age_group: inscription.age_group,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch(`/api/inscriptions/${inscription.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            // Retour au tableau de l'événement et rafraîchissement des données
            router.push(`/admin/inscriptions/${inscription.event_id}`);
            router.refresh();
        } else {
            alert("Une erreur est survenue lors de la modification.");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                    <input required type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2.5" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                    <input required type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2.5" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2.5" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                    <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2.5" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tranche d'âge</label>
                <select name="age_group" value={formData.age_group} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2.5 bg-white">
                    <option value="adulte">Adulte</option>
                    <option value="enfant">Enfant</option>
                </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => router.back()} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors">
                    Annuler
                </button>
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
                    {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
            </div>
        </form>
    );
}