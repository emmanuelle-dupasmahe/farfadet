"use client";

import React, { useState } from 'react';
import { Calendar, Phone, Mail, User, Users, CheckCircle, AlertCircle } from 'lucide-react';

interface EventData {
    id: number;
    title: string;
    event_date: string;
    description: string | null;
}

interface Props {
    event: EventData;
}

export default function ActivityEventRegistration({ event }: Props) {
    // États pour le formulaire
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        ageGroup: 'adulte'
    });

    const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message?: string }>({ type: 'idle' });

    // Formatage de la date en français
    const formattedDate = new Date(event.event_date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: 'loading' });

        try {
            const response = await fetch('/api/activities/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: event.id,
                    ...formData
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Une erreur est survenue lors de l'inscription.");
            }

            setStatus({ type: 'success', message: "Votre inscription a bien été prise en compte par Régis !" });
            // On vide le formulaire
            setFormData({ firstName: '', lastName: '', email: '', phone: '', ageGroup: 'adulte' });

        } catch (error: any) {
            setStatus({ type: 'error', message: error.message });
        }
    };

    if (status.type === 'success') {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center max-w-2xl mx-auto my-8 shadow-sm">
                <CheckCircle className="text-emerald-500 mx-auto mb-4" size={48} />
                <h3 className="text-2xl font-bold text-emerald-900 mb-2">Inscription Validée !</h3>
                <p className="text-emerald-700 font-medium">{status.message}</p>
                <button
                    onClick={() => setStatus({ type: 'idle' })}
                    className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-xl transition-colors text-sm"
                >
                    Inscrire une autre personne
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden max-w-4xl mx-auto my-12 grid grid-cols-1 md:grid-cols-5">

            {/* Colonne Gauche : Infos de l'événement */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-950 p-8 text-white md:col-span-2 flex flex-col justify-between">
                <div>
                    <span className="bg-pink-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        Événement Spécial
                    </span>
                    <h3 className="text-2xl font-extrabold mt-4 mb-3 text-white">{event.title}</h3>

                    <div className="flex items-center gap-2 text-pink-400 font-semibold mb-4 text-sm capitalize">
                        <Calendar size={18} />
                        {formattedDate}
                    </div>

                    {event.description && (
                        <p className="text-slate-300 text-sm leading-relaxed font-medium">
                            {event.description}
                        </p>
                    )}
                </div>

                <div className="mt-8 border-t border-blue-800/60 pt-4 text-xs text-slate-400 font-medium">
                    ⚠️ Inscription gratuite mais obligatoire pour l'organisation des encadrants.
                </div>
            </div>

            {/* Colonne Droite : Le Formulaire */}
            <form onSubmit={handleSubmit} className="p-8 md:col-span-3 space-y-4">
                <h4 className="text-xl font-bold text-slate-800 mb-2">Formulaire d'inscription</h4>

                {status.type === 'error' && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl flex items-center gap-2 text-sm font-medium">
                        <AlertCircle className="text-rose-500 shrink-0" size={18} />
                        {status.message}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nom */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Nom</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Dupas"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Prénom */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Prénom</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Emmanuelle"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Adresse Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="exemple@asstsf.fr"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Téléphone */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Numéro de Téléphone</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="06 12 34 56 78"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Tranche d'âge (Demande de Régis) */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Tranche d'âge du participant</label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            name="ageGroup"
                            value={formData.ageGroup}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all appearance-none"
                        >
                            <option value="adulte">Adulte</option>
                            <option value="enfant">Enfant (Jusqu'à 12 ans)</option>
                        </select>
                    </div>
                </div>

                {/* Bouton Soumettre */}
                <button
                    type="submit"
                    disabled={status.type === 'loading'}
                    className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors mt-4 text-sm"
                >
                    {status.type === 'loading' ? 'Validation en cours...' : "Confirmer mon inscription"}
                </button>
            </form>
        </div>
    );
}