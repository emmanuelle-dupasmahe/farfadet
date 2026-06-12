export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Section Hero / Accroche */}
      <section className="w-full bg-slate-50 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-pink-600 mb-6">
          Vient défier ton mental !
        </h1>
        <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto">
          Association Multi-sports, sports-adaptés et bien-être au service de l'inclusion.
        </p>
      </section>

      {/* Emplacement futur du bandeau défilant */}
      <section className="w-full py-8">
        <p className="text-center text-slate-400 border-2 border-dashed border-slate-200 p-8 max-w-4xl mx-auto">
          [ Le composant du bandeau publicitaire défilant arrivera ici ]
        </p>
      </section>
    </main>
  );
}