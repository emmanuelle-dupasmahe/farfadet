import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Récupérer la liste des événements
export async function GET() {
    try {
        const [rows] = await pool.query('SELECT id, title, activity_name FROM activity_events ORDER BY event_date DESC') as any;
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
    }
}

// Créer un nouvel événement (Formulaire de Régis)
export async function POST(request: Request) {
    try {
        const { activity_name, title, event_date, description, max_places } = await request.json();

        await pool.query(
            `INSERT INTO activity_events (activity_name, title, event_date, description, max_places) 
             VALUES (?, ?, ?, ?, ?)`,
            [activity_name, title, event_date, description, max_places || null]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
    }
}