import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { eventId, firstName, lastName, email, phone, ageGroup } = await request.json();

        // Validation rapide
        if (!eventId || !firstName || !lastName || !email || !phone || !ageGroup) {
            return NextResponse.json({ error: "Tous les champs sont obligatoires" }, { status: 400 });
        }

        // Insertion en BDD
        await pool.query(
            `INSERT INTO activity_registrations (event_id, first_name, last_name, email, phone, age_group) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [eventId, firstName, lastName, email, phone, ageGroup]
        );

        return NextResponse.json({ success: true, message: "Inscription validée !" });
    } catch (error: any) {
        console.error("Erreur Inscription Activité :", error);
        return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
    }
}