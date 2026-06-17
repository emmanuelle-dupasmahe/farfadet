import React from 'react';
import pool from '@/lib/db';
import HeaderClient from './HeaderClient';

export const dynamic = 'force-dynamic';

export default async function Header() {
    let menuItems = [];
    let associationLogo = null; // Variable pour stocker le chemin du logo

    try {
        // 1. Récupération du logo de l'association depuis la configuration globale
        const [settingsRows] = await pool.query('SELECT association_logo FROM site_settings WHERE id = 1') as any;
        if (settingsRows.length > 0) {
            associationLogo = settingsRows[0].association_logo;
        }

        // 2. Récupération de tous les éléments du menu ordonnés par position
        const [rows] = await pool.query('SELECT * FROM header_menu ORDER BY position ASC') as any;

        // Filtrage des menus principaux (ceux qui n'ont pas de parent)
        const parents = rows.filter((item: any) => item.parent_id === null);

        // Association des sous-menus (enfants) à chaque menu principal
        menuItems = parents.map((parent: any) => ({
            ...parent,
            children: rows.filter((child: any) => child.parent_id === parent.id)
        }));
    } catch (error) {
        console.error("Erreur lors de la récupération du menu ou du logo Header :", error);

        // Menu de secours (Fallback) pour éviter le crash du site si la BDD est inaccessible
        menuItems = [
            { id: 1, label: 'Accueil', url: '/', children: [] },
            {
                id: 2, label: 'Nos Activités', url: null, children: [
                    { label: 'Escalade', url: '/escalade' },
                    { label: 'Kayak & Paddle', url: '#kayak' },
                    { label: 'Vélo & SRAV', url: '#velo' }
                ]
            },
            { id: 3, label: 'Contact', url: '/contact', children: [] }
        ];
    }

    // On transmet les menuItems ET le logo dynamique récupéré au composant client
    return <HeaderClient menuItems={menuItems} logoSrc={associationLogo} />;
}