import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // HelloAsso envoie un événement de type 'Order' ou 'Payment'
        // On cible uniquement les paiements validés pour une billetterie
        if (body.eventType === 'Payment' && body.data) {
            const payment = body.data;

            // Extraction des données fournies par HelloAsso
            const helloassoOrderId = payment.order?.id || payment.id;
            const firstName = payment.payer?.firstName || 'Inconnu';
            const lastName = payment.payer?.lastName || 'Inconnu';
            const email = payment.payer?.email || '';
            const amount = payment.amount / 100; // HelloAsso envoie les montants en centimes

            // Le "formSlug" permet de savoir de quel événement il s'agit (ex: course-5km-rotary)
            const eventSlug = payment.formSlug;

            // Insertion sécurisée dans ta base de données MySQL
            await pool.query(
                `INSERT IGNORE INTO event_registrations 
                (event_slug, helloasso_order_id, first_name, last_name, email, amount_paid) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [eventSlug, helloassoOrderId, firstName, lastName, email, amount]
            );
        }

        // On répond toujours un statut 200 à HelloAsso pour confirmer la bonne réception
        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error: any) {
        console.error("Erreur Webhook HelloAsso :", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}