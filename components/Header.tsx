import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="w-full border-b border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

                {/* Le Logo cliquable ramenant à l'accueil */}
                <Link href="/" className="flex items-center gap-4">
                    <Image
                        src="/logo_farfadet.png" 
                        alt="Logo Les Farfadets Vertigo"
                        width={80}
                        height={80}
                        className="object-contain"
                    />
                    <span className="text-2xl font-bold text-pink-600 hidden md:block">
                        Les Farfadets Vertigo
                    </span>
                </Link>

                {/* L'ossature du futur menu déroulant */}
                <nav aria-label="Menu principal">
                    <ul className="flex gap-6 font-semibold text-slate-800">
                        <li><Link href="#enfants" className="hover:text-pink-600">Enfants</Link></li>
                        <li><Link href="#sports" className="hover:text-pink-600">Sports</Link></li>
                        <li><Link href="#bien-etre" className="hover:text-pink-600">Secourisme</Link></li>
                    </ul>
                </nav>

            </div>
        </header>
    );
}