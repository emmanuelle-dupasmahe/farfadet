import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // On "attend" la promesse pour récupérer l'ID
        const { id } = await params;
        
        await pool.query('DELETE FROM activity_registrations WHERE id = ?', [id]);
        
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error("Erreur de suppression :", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        
        // On récupère les champs envoyés par le formulaire
        const { first_name, last_name, email, phone, age_group } = body;
        
        await pool.query(
            'UPDATE activity_registrations SET first_name = ?, last_name = ?, email = ?, phone = ?, age_group = ? WHERE id = ?',
            [first_name, last_name, email, phone, age_group, id]
        );
        
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error("Erreur de modification :", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}