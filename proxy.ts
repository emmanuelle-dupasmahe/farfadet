import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // Import propre depuis next/server

export function proxy(request: NextRequest) {
    // 1. Récupérer le cookie de session
    const session = request.cookies.get('admin_session');

    // 2. Vérifier si l'utilisateur essaie d'accéder à une page d'administration
    const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

    // 3. Si c'est une page admin et qu'il n'y a pas de session, on redirige vers le login
    if (isAdminPage && !session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 4. Si tout est bon, on laisse passer la requête
    return NextResponse.next();
}

// On applique le filtre sur la route admin
export const config = {
    matcher: '/admin/:path*',
};