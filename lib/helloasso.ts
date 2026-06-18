// lib/helloasso.ts

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Récupère un Access Token valide auprès d'HelloAsso
 */
export async function getHelloAssoToken(): Promise<string> {
    const now = Date.now();
    
    // Si le token est encore valide, on le réutilise
    if (cachedToken && now < tokenExpiresAt) {
        return cachedToken;
    }

    // Sinon, on simule l'appel ou on prépare la vraie structure
    try {
        // En attendant lundi, tu peux décommenter ce bloc pour simuler un token de test
        /*
        cachedToken = "mock_token_pour_les_tests";
        tokenExpiresAt = Date.now() + 30 * 60 * 1000;
        return cachedToken;
        */

        const params = new URLSearchParams();
        params.append('client_id', process.env.HELLOASSO_CLIENT_ID || '');
        params.append('client_secret', process.env.HELLOASSO_CLIENT_SECRET || '');
        params.append('grant_type', 'client_credentials');

        const response = await fetch('https://api.helloasso.com/v5/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });

        if (!response.ok) throw new Error("Impossible de s'authentifier à HelloAsso");

        const data = await response.json();
        cachedToken = data.access_token;
        // On retire 60 secondes par sécurité pour éviter les jetons expirés tout juste à la limite
        tokenExpiresAt = now + (data.expires_in - 60) * 1000; 
        
        return cachedToken!;
    } catch (error) {
        console.error("Erreur Auth HelloAsso :", error);
        // Fallback temporaire de test pour que ton site ne plante pas en local d'ici lundi
        return "mock_token_local";
    }
}