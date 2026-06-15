import React from 'react';
import pool from '@/lib/db';
import EventBannerClient from './EventBannerClient';

export default async function EventBanner() {
    let activeEvents = [];

    try {
        // On récupère les 3 derniers événements ajoutés
        const [rows] = await pool.query('SELECT * FROM events ORDER BY id DESC LIMIT 3') as any;
        activeEvents = rows;
    } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
    }

    // On envoie le tableau complet à notre composant d'affichage
    return <EventBannerClient dbEvents={activeEvents} />;
}