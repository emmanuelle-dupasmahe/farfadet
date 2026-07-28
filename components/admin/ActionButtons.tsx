'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit } from 'lucide-react';

export default function ActionButtons({ inscriptionId }: { inscriptionId: number }) {
    const router = useRouter();

    const handleDelete = async () => {
        const isConfirmed = window.confirm("Es-tu sûre de vouloir supprimer cette inscription ? Cette action est irréversible.");
        
        if (isConfirmed) {
            const res = await fetch(`/api/inscriptions/${inscriptionId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                // Rafraîchit la page instantanément pour faire disparaître la ligne
                router.refresh(); 
            } else {
                alert("Une erreur est survenue lors de la suppression.");
            }
        }
    };

    const handleEdit = () => {
        // Redirige vers une page de modification (que tu pourras créer)
        router.push(`/admin/inscriptions/modifier/${inscriptionId}`);
    };

    return (
        <div className="flex gap-3 items-center">
            <button onClick={handleEdit} className="text-blue-600 hover:text-blue-800 transition-colors" title="Modifier">
                <Edit size={18} />
            </button>
            <button onClick={handleDelete} className="text-red-600 hover:text-red-800 transition-colors" title="Supprimer">
                <Trash2 size={18} />
            </button>
        </div>
    );
}