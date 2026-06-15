import pool from "@/lib/db"; // Assure-toi que le chemin correspond bien à ton fichier db.ts

export default async function TestDBPage() {
    try {
        // On exécute notre requête SQL
        const [rows] = await pool.query("SELECT * FROM photos");

        // Si ça marche, on affiche le résultat en vert
        return (
            <div className="p-10 max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-lg border border-slate-100">
                <h1 className="text-3xl font-bold text-green-600 mb-6">Connexion réussie ! 🎉</h1>
                <p className="text-slate-600 mb-4">Voici ce que Next.js a trouvé dans ta base de données :</p>

                {/* On affiche les données brutes (JSON) pour vérifier */}
                <pre className="bg-slate-900 text-pink-400 p-6 rounded-lg overflow-x-auto">
                    {JSON.stringify(rows, null, 2)}
                </pre>
            </div>
        );

    } catch (error) {
        // Si la connexion échoue, on affiche l'erreur en rouge
        return (
            <div className="p-10 max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-lg border border-slate-100">
                <h1 className="text-3xl font-bold text-red-600 mb-6">Erreur de connexion 🚨</h1>
                <p className="text-slate-800 font-medium mb-2">Vérifie ton fichier .env.local ou que Laragon est bien lancé.</p>
                <pre className="bg-red-50 text-red-900 p-4 rounded-lg overflow-x-auto text-sm">
                    {String(error)}
                </pre>
            </div>
        );
    }
}