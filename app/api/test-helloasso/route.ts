// app/api/test-helloasso/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    const clientId = process.env.HELLOASSO_CLIENT_ID;
    const clientSecret = process.env.HELLOASSO_CLIENT_SECRET;

    try {
        // Appel à l'API d'authentification de HelloAsso
        const response = await fetch('https://api.helloasso.com/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId || '',
                client_secret: clientSecret || '',
                grant_type: 'client_credentials',
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ 
                success: false, 
                error: "Erreur d'authentification HelloAsso", 
                details: data 
            }, { status: response.status });
        }

        return NextResponse.json({ 
            success: true, 
            message: "Connexion réussie ! Vos identifiants .env.local sont corrects.", 
            access_token: data.access_token 
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}