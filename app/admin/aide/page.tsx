import React from 'react';
import { HelpCircle, Bookmark, Megaphone, Calendar, Link, ArrowRight, Layers, FileText } from 'lucide-react';

export default function AdminHelpPage() {
    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
                <div className="bg-pink-600 p-2 rounded-xl text-white">
                    <HelpCircle size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Guide & Aide d'Utilisation</h1>
                    <p className="text-sm text-slate-500 font-medium mt-0.5">Mémos pratiques pour gérer sereinement le contenu de l'association</p>
                </div>
            </div>

            {/* Grille des guides */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* FICHE 1 : LE BANDEAU D'ACTUALITÉ */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Megaphone size={20} className="text-blue-600" />
                        Bandeau d'Actualité (Sarah & Régis)
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Cette section sert à publier des alertes défilantes en haut du site. Seuls les <strong>3 messages les plus récents</strong> s'affichent sur la page d'accueil.
                    </p>
                    <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 space-y-2">
                        <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1">
                            <Link size={14} /> Astuce : Liens vers un formulaire interne
                        </h3>
                        <p className="text-slate-700 text-xs leading-relaxed">
                            Si Régis a configuré un stage (ex: Escalade) et que vous voulez que le bouton du bandeau envoie l'utilisateur directement dessus sans défiler :
                        </p>
                        <ul className="text-xs text-slate-700 list-disc list-inside mt-1 font-medium space-y-1">
                            <li><strong>Texte du bouton :</strong> <span className="text-pink-600">S'inscrire au stage</span></li>
                            <li><strong>Lien (URL) :</strong> <span className="text-blue-700 font-mono">/escalade#inscription</span></li>
                        </ul>
                        <p className="text-[10px] text-slate-500 italic mt-1">
                            Remplacez <span className="font-mono">/escalade</span> par le slug du sport désiré. L'ajout de <span className="font-mono">#inscription</span> descend automatiquement la page au formulaire.
                        </p>
                    </div>
                </div>

                {/* FICHE 2 : PLANIFICATION DE STAGES */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Calendar size={20} className="text-pink-600" />
                        Planifier un Stage / Sortie (Régis)
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Pour proposer une journée spéciale ou un stage sur une page de sport :
                    </p>
                    <ol className="text-xs text-slate-600 list-decimal list-inside space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <li>Allez dans <strong>Bandeau Événements</strong> (section du bas).</li>
                        <li>Créez le stage en choisissant l'activité cible.</li>
                        <li>Rendez-vous dans <strong>Textes des pages</strong>.</li>
                        <li>Modifiez l'activité concernée et sélectionnez votre nouveau stage dans le menu déroulant tout en bas avant de valider.</li>
                    </ol>
                    <p className="text-xs text-slate-500 italic">
                        💡 Une fois rattaché, le formulaire d'inscription gratuit se génère tout seul sur la page publique. Les inscrits sont consultables via le bouton <strong>"Voir les inscrits"</strong>.
                    </p>
                </div>

                {/* FICHE 3 : LES TEXTES DES PAGES */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <FileText size={20} className="text-emerald-600" />
                        Modifier les Textes (Sarah)
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Toutes les pages de sports et rubriques thématiques sont modifiables sans code depuis l'onglet <strong>Textes des pages</strong>.
                    </p>
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-800 space-y-1">
                        <p className="font-bold">⚠️ Attention à la mise en page :</p>
                        <p className="leading-relaxed">
                            Pour sauter une ligne proprement sur le site public, appuyez simplement sur la touche <strong>Entrée</strong> dans les zones de texte. N'utilisez pas de caractères bizarres.
                        </p>
                    </div>
                </div>

                {/* FICHE 4 : CARTES D'ACCUEIL & HOVER */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Layers size={20} className="text-amber-600" />
                        Cartes d'Activités (Accueil)
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Les 3 grands blocs de l'accueil (Sports & Nature, Bien-être, Enfants & Séjours) se configurent via l'onglet <strong>Cartes d'activités</strong>.
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed bg-amber-50/50 border border-amber-100 p-3 rounded-xl">
                        Chaque bloc redirige l'utilisateur vers une page pilier du site. Veillez à ce que l'URL saisie corresponde bien à une page active (ex: <span className="font-mono">/secourisme</span>).
                    </p>
                </div>

            </div>

            {/* Note de bas de page */}
            <div className="bg-slate-800 text-slate-300 rounded-xl p-4 text-center text-xs font-medium">
                🛠️ Ce panneau d'administration est conçu sur mesure pour s'adapter à votre fonctionnement. Pour toute évolution technique majeure, contactez votre développeur.
            </div>

        </div>
    );
}