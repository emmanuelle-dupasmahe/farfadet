export default function Home() {
  return (
    <main className="min-h-screen">
      {/* On commence directement par le Hero ou le contenu de la page */}
      <section className="w-full bg-slate-50 py-24 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-pink-600 mb-6 drop-shadow-sm">
          Vient défier ton mental !
        </h1>
        <p className="text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto font-medium">
          Association Multi-sports, sports-adaptés et bien-être au service de l'inclusion et du handicap.
        </p>
      </section>

      {/* Reste de tes sections (Tuiles d'activités, etc.) */}
      <section className="h-[1000px] bg-white p-10">
      </section>
    </main>
  );
}