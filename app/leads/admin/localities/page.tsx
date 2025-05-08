"use client"

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { UserNav } from '@/components/ui/tabs';

interface AuthResponse {
    userRoles: string[];
}

interface Region {
    regione: string;
    id_regione: number;
}

interface Province {
    provincia: string;
    sigla: string;
}

interface Town {
    comune: string;
    cap: string;
    provincia: string;
    regione: string;
}

function UserLocalitiesContent() {
    const searchParams = useSearchParams();
    const userId = searchParams.get('user_id');
    const userName = searchParams.get('name');

    const [isAdminCheck, setIsAdmin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [regions, setRegions] = useState<Region[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [towns, setTowns] = useState<Town[]>([]);
    const [selectedRegion, setSelectedRegion] = useState<string>('');
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedTowns, setSelectedTowns] = useState<string[]>([]);
    const [assignedAreas, setAssignedAreas] = useState<string[]>([]);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/session');
                const data: AuthResponse = await response.json();
                setIsAdmin(data.userRoles[0].split('|')[1] === 'admin');
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await fetch('/api/leads/geoData/regions');
                const data = await response.json();
                setRegions(data);
            } catch (error) {
                console.error('Error fetching regions:', error);
            }
        };
        fetchRegions();
    }, []);

    useEffect(() => {
        const fetchAssignedAreas = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`/api/leads/user/cities/${userId}`);
                const data = await response.json();
                if (data[0]?.user_config) {
                    setAssignedAreas(JSON.parse(data[0].user_config));
                }
            } catch (error) {
                console.error('Error fetching assigned areas:', error);
            }
        };
        fetchAssignedAreas();
    }, [userId]);

    useEffect(() => {
        const fetchProvinces = async () => {
            if (!selectedRegion) return;
            const region = regions.find(r => r.regione === selectedRegion);
            if (!region) return;

            try {
                const response = await fetch(`/api/leads/geoData/provinces/${region.id_regione}`);
                const data = await response.json();
                setProvinces(data);
                setSelectedProvince('');
                setTowns([]);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };
        fetchProvinces();
    }, [selectedRegion, regions]);

    useEffect(() => {
        const fetchTowns = async () => {
            if (!selectedProvince) return;
            const province = provinces.find(p => p.provincia === selectedProvince);
            if (!province) return;

            try {
                const response = await fetch(`/api/leads/geoData/towns/${province.sigla}`);
                const data = await response.json();
                setTowns(data);
            } catch (error) {
                console.error('Error fetching towns:', error);
            }
        };
        fetchTowns();
    }, [selectedProvince, provinces]);

    const handleRemoveArea = (area: string) => {
        setAssignedAreas(prev => prev.filter(a => a !== area));
        setSelectedTowns(prev => prev.filter(t => t !== area));
    };

    const handleAssignAreas = async () => {
        if (!userId) return;

        try {
            const response = await fetch('/api/leads/user/updateCity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    config_data: assignedAreas
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update cities');
            }

            toast.success('Comuni aggiornati con successo');
            setSelectedTowns([]); // Clear selections after saving
        } catch (error) {
            console.error('Error updating user cities:', error);
            toast.error('Errore durante l\'aggiornamento dei comuni');
        }
    };

    const handleTownSelection = (town: string) => {
        setSelectedTowns(prev => {
            const newSelectedTowns = prev.includes(town)
                ? prev.filter(t => t !== town)
                : [...prev, town];

            if (!prev.includes(town)) {
                setAssignedAreas(current => {
                    if (!current.includes(town)) {
                        return [...current, town];
                    }
                    return current;
                });
            }

            return newSelectedTowns;
        });
    };

    if (isLoading) {
        return <div className="bg-[#011529] min-h-screen" />;
    }

    if (!isAdminCheck) {
        return (
            <div className="bg-[#011529] min-h-screen flex justify-center items-center">
                <div className="text-center text-white">
                    <h1 className="text-2xl font-semibold mb-2">Accesso Negato</h1>
                    <p>Non hai i permessi necessari per visualizzare questa pagina.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#011529] min-h-screen">
            <div className="py-12 md:py-24 lg:py-32 mx-auto w-3/4">
                <UserNav />
                <div className="bg-white rounded-xl p-6">
                    <h1 className="text-2xl font-semibold mb-6 text-center">
                        Configurazione ambito di ricerca per {userName}
                    </h1>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h2 className="text-lg font-medium mb-4">Seleziona i comuni di pertinenza da assegnare all'utente</h2>

                            <div>
                                <label className="block mb-2 font-bold">Regione</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                >
                                    <option value="">Qualsiasi</option>
                                    {regions.map((region) => (
                                        <option key={region.id_regione} value={region.regione}>
                                            {region.regione}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 font-bold">Provincia</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={selectedProvince}
                                    onChange={(e) => setSelectedProvince(e.target.value)}
                                >
                                    <option value="">Qualsiasi</option>
                                    {provinces.map((province) => (
                                        <option key={province.sigla} value={province.provincia}>
                                            {province.provincia}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 font-bold">Seleziona località da aggiungere</label>
                                <div className="max-h-60 overflow-y-auto border rounded">
                                    {towns.map((town) => (
                                        <div
                                            key={town.comune}
                                            className="flex items-center p-2 hover:bg-gray-100"
                                        >
                                            <input
                                                type="checkbox"
                                                id={town.comune}
                                                checked={selectedTowns.includes(town.comune)}
                                                onChange={() => handleTownSelection(town.comune)}
                                                className="mr-2"
                                            />
                                            <label htmlFor={town.comune} className="cursor-pointer flex-1">
                                                {town.comune}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {towns.length > 0 && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        Selezionati: {selectedTowns.length} comuni
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleAssignAreas}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white w-full px-4 py-2 rounded"
                            >
                                Salva modifiche
                            </button>
                        </div>

                        <div>
                            <h2 className="text-lg font-medium mb-4">Aree assegnate</h2>
                            <div className="space-y-2">
                                {assignedAreas.map((area) => (
                                    <div key={area} className="flex items-center justify-between bg-white p-2 rounded border">
                                        <span>{area}</span>
                                        <button
                                            onClick={() => handleRemoveArea(area)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="bg-[#011529] min-h-screen flex justify-center items-center">
            <div className="text-white">Caricamento...</div>
        </div>
    );
}

export default function UserLocalities() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <UserLocalitiesContent />
        </Suspense>
    );
}