import React from 'react';
import pool from '@/lib/db';
import EditForm from './EditForm';

export const dynamic = 'force-dynamic';

export default async function EditRegistrationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Récupération des données actuelles de l'inscription
    const [rows] = await pool.query('SELECT * FROM activity_registrations WHERE id = ?', [id]) as any;
    const inscription = rows[0];

    if (!inscription) {
        return <div className="p-8 text-center font-medium">Inscription introuvable.</div>;
    }

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Modifier l'inscription</h1>
            <p className="text-slate-500 mb-8">
                Mise à jour des informations pour {inscription.first_name} {inscription.last_name}.
            </p>
            
            {/* On passe les données au composant client qui gère le formulaire */}
            <EditForm inscription={inscription} />
        </div>
    );
}