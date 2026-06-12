import React from 'react';
import Link from 'next/link';
import {
    Mountain,
    Waves,
    Bike,
    Target,
    Compass,
    Dumbbell,
    HeartPulse,
    Users
} from 'lucide-react';

const activities = [
    {
        title: "Escalade",
        description: "Prendre de la hauteur et défier ses limites en toute sécurité.",
        icon: <Mountain className="w-8 h-8" />,
        color: "bg-pink-600",
        href: "/escalade"
    },
    {
        title: "Kayak & Paddle",
        description: "Équilibre et plaisir sur l'eau pour tous les niveaux.",
        icon: <Waves className="w-8 h-8" />,
        color: "bg-blue-600",
    },
    {
        title: "SRAV & Vélo",
        description: "Savoir Rouler À Vélo : autonomie et agilité sur deux roues.",
        icon: <Bike className="w-8 h-8" />,
        color: "bg-pink-600",
    },
    {
        title: "Tir à l'arc",
        description: "Concentration et précision pour viser le plein cœur.",
        icon: <Target className="w-8 h-8" />,
        color: "bg-blue-600",
    },
    {
        title: "Randonnées",
        description: "Découvrir la nature à son rythme, ensemble.",
        icon: <Compass className="w-8 h-8" />,
        color: "bg-pink-600",
    },
    {
        title: "Renforcement & Stretching",
        description: "Prendre soin de son corps et de son mental.",
        icon: <Dumbbell className="w-8 h-8" />,
        color: "bg-blue-600",
    },
    {
        title: "Secourisme",
        description: "Apprendre les gestes qui sauvent (GQS).",
        icon: <HeartPulse className="w-8 h-8" />,
        color: "bg-pink-600",
    },
    {
        title: "Handicap & Inclusion",
        description: "Des programmes adaptés pour tous, sans exception.",
        icon: <Users className="w-8 h-8" />,
        color: "bg-blue-950",
    },
];

export default function ActivityGrid() {
    return (
        <section className="py-16 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    Découvrez nos activités
                </h2>
                <div className="w-24 h-1 bg-pink-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {activities.map((activity, index) => (
                    <Link
                        key={index}
                        href={activity.href || "#"} // Utilise le lien, ou met "#" par défaut s'il n'y en a pas encore
                        className="group block p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className={`${activity.color} text-white w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            {activity.icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                            {activity.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            {activity.description}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}