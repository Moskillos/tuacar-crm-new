'use client';

import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

export function PeriziaPop({
    lead
}: any) {

    //GET PERIZIA / DIC. CONFORMITA'
    const [perizia, setPerizia] = useState<any>(null)
    const [dichiarazione, setDichiarazione] = useState<any>(null)
    const [isPeriziaLoading, setIsPeriziaLoading] = useState(true)
    const [isDichiarazioneLoading, setIsDichiarazioneLoading] = useState(true)

    const getPerizia = async () => {
        try {
            const params = new URLSearchParams({
                action: 'getPeriziaByCarId',
                carId: lead.id,
                tipo: 'perizia'
            }).toString();

            const response = await fetch(`/api/garage?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            setPerizia(data.data[0]);
            setIsPeriziaLoading(false);

            return true;
        } catch (error) {
            console.error('Failed to fetch perizia:', error);
        }
    }

    const getDichiarazione = async () => {
        try {
            const params = new URLSearchParams({
                action: 'getPeriziaByCarId',
                carId: lead.id,
                tipo: 'dichiarazione'
            }).toString();

            const response = await fetch(`/api/garage?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            setDichiarazione(data.data[0]);
            setIsDichiarazioneLoading(false);

            return true;
        } catch (error) {
            console.error('Failed to fetch perizia:', error);
        }
    }

    useEffect(() => {
        getPerizia()
        getDichiarazione()
    }, [])

    const periziaItems = [
        { key: 'ammortizzatori', name: 'Ammortizzatori' },
        { key: 'batteria', name: 'Batteria' },
        { key: 'chiusureCentralizzate', name: 'Chiusure Centralizzate' },
        { key: 'cinghieTendicinghie', name: 'Cinghie Tendicinghie' },
        { key: 'condizionamentoVentilazione', name: 'Condizionamento Ventilazione' },
        { key: 'frizione', name: 'Frizione' },
        { key: 'impiantoScarico', name: 'Impianto Scarico' },
        { key: 'luci', name: 'Luci' },
        { key: 'motore', name: 'Motore' },
        { key: 'pinzeFreniDischi', name: 'Pinze Freni Dischi' }
    ]

    const updatePerizia = async (id: string, key: string, value: string, target: string) => {
        const method = 'POST';
        const body = JSON.stringify({
            action: 'updatePeriziaById',
            periziaId: id,
            perizia: { [key]: value }
        });

        try {
            const response = await fetch('/api/garage', {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            await response.json();
            target == 'perizia' ? setPerizia((prevState: any) => ({ ...prevState, [key]: value })) : setDichiarazione((prevState: any) => ({ ...prevState, [key]: value }))
            toast('Perizia aggiornata')
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    return (
        <>
            <Toaster />
            <div className="w-full mx-auto pt-2 mt-5">
                <div className="flex justify-between items-center gap-2 mb-2">
                    <div className="flex gap-2 items-center w-full">
                        <p className="text-2xl font-semilight mb-2">{lead.marca + " " + lead.modello}</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2 mt-5">
                <div className="rounded-2xl border border-slate-200">
                    <div className="bg-slate-200 rounded-b rounded-2xl p-4 text-slate-800 font-light">
                        Perizia
                    </div>
                    {!isPeriziaLoading &&
                        <div className="p-4 grid grid-cols-2 gap-2">
                            {periziaItems.map((p) => (
                                <>
                                    <p className="mb-1 font-light">{p.name}</p>
                                    <div className="text-slate-800 font-light grid grid-cols-3">
                                        <div
                                            onClick={() => updatePerizia(perizia.id, p.key, 'Buono', 'perizia')}
                                            className={` ${perizia?.[p.key] == 'Buono' ? 'bg-slate-300' : 'bg-slate-200'} p-1 text-center hover:bg-slate-300`}
                                        >
                                            Buono
                                        </div>
                                        <div
                                            onClick={() => updatePerizia(perizia.id, p.key, 'Medio', 'perizia')}
                                            className={` ${perizia?.[p.key] == 'Medio' ? 'bg-slate-300' : 'bg-slate-200'} p-1 text-center hover:bg-slate-300`}
                                        >
                                            Medio
                                        </div>
                                        <div
                                            onClick={() => updatePerizia(perizia.id, p.key, 'Sostituire', 'perizia')}
                                            className={` ${perizia?.[p.key] == 'Sostituire' ? 'bg-slate-300' : 'bg-slate-200'} p-1 text-center hover:bg-slate-300`}
                                        >
                                            Sostituire
                                        </div>
                                    </div>
                                </>
                            ))}
                        </div>
                    }
                </div>
                <div className="rounded-2xl border border-slate-200">
                    <div className="bg-slate-200 rounded-b rounded-2xl p-4 text-slate-800 font-light">
                        Dichiarazione di conformità
                    </div>
                    {!isDichiarazioneLoading &&
                        <div className="p-4 grid grid-cols-2 gap-2">
                            {periziaItems.map((p) => (
                                <>
                                    <p className="mb-1 font-light">{p.name}</p>
                                    <div className="text-slate-800 font-light grid grid-cols-3">
                                        <div
                                            onClick={() => updatePerizia(dichiarazione.id, p.key, 'Buono', 'dichiarazione')}
                                            className={` ${dichiarazione?.[p.key] == 'Buono' ? 'bg-slate-300' : 'bg-slate-200'} p-1 text-center hover:bg-slate-300`}
                                        >
                                            Buono
                                        </div>
                                        <div
                                            onClick={() => updatePerizia(dichiarazione.id, p.key, 'Medio', 'dichiarazione')}
                                            className={` ${dichiarazione?.[p.key] == 'Medio' ? 'bg-slate-300' : 'bg-slate-200'} p-1 text-center hover:bg-slate-300`}
                                        >
                                            Medio
                                        </div>
                                        <div
                                            onClick={() => updatePerizia(dichiarazione.id, p.key, 'Sostituire', 'dichiarazione')}
                                            className={` ${dichiarazione?.[p.key] == 'Sostituire' ? 'bg-slate-300' : 'bg-slate-200'} p-1 text-center hover:bg-slate-300`}
                                        >
                                            Sostituire
                                        </div>
                                    </div>
                                </>
                            ))}
                        </div>
                    }
                </div>
            </div>
        </>
    );
}
