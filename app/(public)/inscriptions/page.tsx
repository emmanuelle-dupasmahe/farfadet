import React from 'react';
import { Calendar, MapPin, Trophy } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InscriptionsPage() {
    // Lundi, ces informations pourront être stockées en BDD (ex: table `page_contents`)
    const eventTitle = "Course Solidaire 5km";
    const eventPartner = "En partenariat avec le Rotary Club";
    const eventDescription = "Rejoignez-nous pour une course conviviale et solidaire au profit de l'inclusion et du sport adapté. Ouvert à tous, petits et grands !";

    // Remplacer par le vrai lien HelloAsso fourni par Sarah/Régis dès qu'il sera prêt
    const helloAssoFormUrl = "https://www.helloasso.com/associations/les-farfadets-vertigo/evenements/course-test";
    const isRegistrationOpen = false; // Passe-le à 'true' dès que le lien est actif

    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {/* En-tête de l'événement */}
                <div className="bg-pink-600 p-8 text-white text-center">
                    <span className="bg-pink-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        Événement Ponctuel
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold mt-3 mb-2">{eventTitle}</h1>
                    <p className="text-pink-100 font-medium">{eventPartner}</p>
                </div>

                {/* Détails */}
                <div className="p-8 space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        {eventDescription}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-slate-100 py-6 my-6">
                        <div className="flex items-center gap-3 text-slate-700">
                            <Calendar className="text-pink-600 shrink-0" size={24} />
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Date</p>
                                <p className="font-semibold text-sm">À venir (Courant 2026)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700">
                            <MapPin className="text-pink-600 shrink-0" size={24} />
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Lieu</p>
                                <p className="font-semibold text-sm">Précisé prochainement</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700">
                            <Trophy className="text-pink-600 shrink-0" size={24} />
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Distance</p>
                                <p className="font-semibold text-sm">5 km Marche / Course</p>
                            </div>
                        </div>
                    </div>

                    {/* Bouton d'action Tampon */}
                    <div className="text-center pt-4">
                        {isRegistrationOpen ? (
                            <a
                                href={helloAssoFormUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-pink-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-md hover:bg-pink-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                            >
                                S'inscrire sur HelloAsso &rarr;
                            </a>
                        ) : (
                            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl inline-block max-w-md font-medium text-sm">
                                📌 Les inscriptions ne sont pas encore ouvertes. Dès que la date sera validée par l'association, le lien d'inscription sera disponible ici.
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </main>
    );
}