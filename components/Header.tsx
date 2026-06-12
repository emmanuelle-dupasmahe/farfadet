import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full bg-pink-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

                {/* Le Logo cliquable */}
                <Link href="/" className="flex items-center gap-4 group">
                    <Image
                        src="/logo_farfadet.png"
                        alt="Logo Les Farfadets Vertigo"
                        width={70}
                        height={70}
                        className="object-contain w-auto h-auto max-h-16 transition-transform group-hover:scale-105"
                    />
                    <span className="text-xl md:text-2xl font-bold tracking-tight">
                        Les Farfadets Vertigo
                    </span>
                </Link>

                {/* Menu */}
                <nav aria-label="Menu principal">
                    <ul className="flex gap-6 font-semibold">
                        <li>
                            <Link href="#enfants" className="hover:text-pink-200 transition-colors">
                                Enfants
                            </Link>
                        </li>
                        <li>
                            <Link href="#sports" className="hover:text-pink-200 transition-colors">
                                Sports
                            </Link>
                        </li>
                        <li>
                            <Link href="#bien-etre" className="hover:text-pink-200 transition-colors">
                                Secourisme
                            </Link>
                        </li>
                    </ul>
                </nav>

            </div>
        </header>
    );
}