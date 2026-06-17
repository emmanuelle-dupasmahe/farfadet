import pool from "@/lib/db";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // 1. Valeurs par défaut
  let heroTitle = "Viens défier ton mental !";
  let heroSubtitle = "Association Multi-sports, sports-adaptés et bien-être au service de l'inclusion et du handicap.";

  // 2. Récupérer les textes configurés pour le Hero de l'accueil
  try {
    const [textRows] = await pool.query(
      'SELECT * FROM page_contents WHERE page_slug = "accueil"'
    ) as any;

    const content = textRows.reduce((acc: any, row: any) => {
      acc[row.content_key] = row.content_value;
      return acc;
    }, {});

    if (content.hero_title) heroTitle = content.hero_title;
    if (content.hero_subtitle) heroSubtitle = content.hero_subtitle;
  } catch (error) {
    console.error("Erreur lors de la récupération des textes de l'accueil :", error);
  }

  // 3. Récupérer les cartes d'activités
  let cards = [];
  try {
    const [cardRows] = await pool.query('SELECT * FROM home_cards ORDER BY id ASC') as any;
    cards = cardRows;
  } catch (error) {
    console.error("Erreur lors de la récupération des cartes :", error);
  }

  // 4. Récupérer le numéro de téléphone et le logo depuis la configuration globale
  let contactPhone = "06 20 78 49 14";
  let associationLogo = "/farfadet.png"; // Fallback vers ton image d'origine

  try {
    const [settingsRows] = await pool.query('SELECT * FROM site_settings WHERE id = 1') as any;
    if (settingsRows.length > 0) {
      if (settingsRows[0].phone) {
        contactPhone = settingsRows[0].phone;
      }
      if (settingsRows[0].association_logo) {
        associationLogo = settingsRows[0].association_logo;
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres globale :", error);
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Section Hero (Texte seulement) */}
      <section className="w-full bg-white py-24 px-4 text-center border-b border-slate-100">
        <h1 className="text-5xl md:text-7xl font-extrabold text-pink-600 mb-6 drop-shadow-sm">
          {heroTitle}
        </h1>
        <p className="text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto font-medium leading-relaxed mb-8">
          {heroSubtitle}
        </p>
      </section>

      {/* SECTION DES CARTES AVEC LE LOGO EN ARRIÈRE-PLAN */}
      <section className="relative pt-2 pb-12 px-4 max-w-7xl mx-auto mt-24 md:mt-16">

        {/* LE LOGO (Positionnement initial préservé à 100 %) */}
        <div className="absolute -top-36 md:-top-53 left-1/2 -translate-x-1/2 z-0 drop-shadow-lg pointer-events-none">
          <img
            src={associationLogo}
            alt="Logo Les Farfadets Vertigo"
            className="w-40 md:w-56 h-auto object-contain animate-fade-in"
          />
        </div>

        {/* LA GRILLE */}
        {cards.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-slate-500 italic">
            Aucune carte d'activité n'est configurée en base de données.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {cards.map((card: any) => (
              <div
                key={card.id}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <h3 className="text-2xl font-bold text-blue-950 mb-3">{card.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{card.description}</p>
                </div>
                {card.link_url && (
                  <Link
                    href={card.link_url}
                    className="text-pink-600 font-bold text-sm mt-6 inline-block hover:text-pink-700 transition-colors"
                  >
                    En savoir plus &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section Contact de bas de page avec téléphone dynamique */}
      <section className="py-20 bg-blue-950 text-white text-center">
        <h2 className="text-3xl font-bold mb-2">Prêt à nous rejoindre ?</h2>
        <p className="text-slate-300 text-lg">
          Contactez-nous au{" "}
          <a
            href={`tel:${contactPhone.replace(/\s/g, '')}`}
            className="text-pink-400 font-bold hover:underline transition-colors"
          >
            {contactPhone}
          </a>
        </p>
      </section>

    </main>
  );
}