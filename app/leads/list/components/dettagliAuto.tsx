'use client';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

export function DettagliPop({
    lead,
}: any) {

    const [accessori, setAccessori] = useState(lead.accessori ?? {});

    const mappedKeys: any = {
        "ESP": "Controllo di Stabilità",
        "airbag": "Airbag",
        "isofix": "Attacchi ISOFIX",
        "antifurto": "Antifurto",
        "autoradio": "Autoradio",
        "bracciolo": "Bracciolo",
        "camera360": "Telecamera 360°",
        "fariLaser": "Fari Laser",
        "fariXenon": "Fari Xenon",
        "hillHolder": "Sistema Hill Holder",
        "navigatore": "Navigatore Satellitare",
        "FariFullLED": "Fari Full LED",
        "androidAuto": "Compatibile con Android Auto",
        "fendiNebbia": "Fendinebbia",
        "sediliSport": "Sedili Sportivi",
        "sensoreLuce": "Sensore di Luce",
        "servoSterzo": "Servosterzo",
        "soundSystem": "Impianto Audio Premium",
        "appleCarPlay": "Compatibile con Apple CarPlay",
        "cerchiInLega": "Cerchi in Lega",
        "gancioTraino": "Gancio Traino",
        "voiceControl": "Comandi Vocali",
        "cruiseControl": "Cruise Control",
        "headUpDisplay": "Head-Up Display",
        "leveAlVolante": "Leve Cambio al Volante",
        "luciDiurneLed": "Luci Diurne a LED",
        "rangeExtender": "Range Extender",
        "ruotiniScorta": "Ruotino di Scorta",
        "startStopAuto": "Start & Stop Automatico",
        "tettoApribile": "Tetto Apribile",
        "vetriOscurati": "Vetri Oscurati",
        "airbagLaterali": "Airbag Laterali",
        "climaAuto2Zone": "Climatizzatore Automatico Bi-Zona",
        "climaAuto3Zone": "Climatizzatore Automatico Tri-Zona",
        "climaAuto4Zone": "Climatizzatore Automatico Quadri-Zona",
        "climatizzatore": "Climatizzatore",
        "interniInPelle": "Interni in Pelle",
        "sensorePioggia": "Sensore Pioggia",
        "sistemaCallSOS": "Sistema di Chiamata SOS",
        "antifurtoSatell": "Antifurto Satellitare",
        "chiamataAutoSOS": "Chiamata Automatica SOS",
        "fariDirezionali": "Fari Direzionali",
        "sediliVentilati": "Sedili Ventilati",
        "sistemaLavafari": "Sistema Lavafari",
        "tettoPanoramico": "Tetto Panoramico",
        "tractionControl": "Controllo della Trazione",
        "airbagPosteriore": "Airbag Posteriore",
        "frenataAssistita": "Frenata Assistita",
        "handicapFriendly": "Accessibilità per Disabili",
        "regolElettSedili": "Regolazione Elettrica Sedili",
        "sediliRiscaldati": "Sedili Riscaldati",
        "sensoriParchPost": "Sensori di Parcheggio Posteriori",
        "sistemaParchAuto": "Sistema di Parcheggio Automatico",
        "autoradioDigitale": "Autoradio Digitale",
        "controlElettCorsia": "Controllo Elettronico di Corsia",
        "divisoriBagagliaio": "Divisori per Bagagliaio",
        "frenoStazElettrico": "Freno di Stazionamento Elettrico",
        "portaScorrLaterale": "Porta Scorrevole Laterale",
        "sediliMassaggianti": "Sedili Massaggianti",
        "sedilePostSdoppiato": "Sedile Posteriore Sdoppiato",
        "volanteRiscaldabile": "Volante Riscaldabile",
        "regolElettSediliPost": "Regolazione Elettrica Sedili Posteriori",
        "sensoriParcheggioAnt": "Sensori di Parcheggio Anteriori",
        "telecameraParcheggio": "Telecamera per Parcheggio",
        "assistenteAbbaglianti": "Assistente Abbaglianti",
        "cruiseControlAdattivo": "Cruise Control Adattivo",
        "riconoscimentoSegnali": "Riconoscimento Segnali Stradali",
        "sistemaAvvisoDistanza": "Sistema di Avviso Distanza",
        "sistemaVisioneNotturna": "Sistema di Visione Notturna",
        "sospensioniPneumatiche": "Sospensioni Pneumatiche",
        "portellonePostElettrico": "Portellone Posteriore Elettrico",
        "riscaldamentoAusiliario": "Riscaldamento Ausiliario",
        "specchiettiLatElettrici": "Specchietti Laterali Elettrici",
        "monitPressionePneumatici": "Monitoraggio Pressione Pneumatici",
        "caricaInduzioneSmartphone": "Ricarica Wireless Smartphone",
        "chiusuraCentralizzataNoKey": "Chiusura Centralizzata Senza Chiave",
        "speccRetroAntiabbagliamento": "Specchietto Retrovisore Antiabbagliamento",
        "chiusuraCentralizzataTelecom": "Chiusura Centralizzata con Telecomando",
        "fariProfonditaAntiabbagliamento": "Fari con Regolazione Profondità Antiabbagliamento",
        "sistemaDiRiconoscimentoStanchezza": "Sistema di Riconoscimento Stanchezza"
    }

    const [search, setSearch] = useState('')

    // useEffect(() => {
    //     const updateCar = async () => {
    //         if (accessori !== lead.accessori) {
    //             console.log("UPDATE");
    //             const method = 'POST';
    //             const body = JSON.stringify({
    //                 action: 'updateCarById',
    //                 carId: lead.id,
    //                 car: {
    //                     accessori: accessori
    //                 }
    //             });

    //             try {
    //                 const response = await fetch('/api/garage', {
    //                     method,
    //                     headers: {
    //                         'Content-Type': 'application/json'
    //                     },
    //                     body
    //                 });

    //                 if (!response.ok) {
    //                     throw new Error(`HTTP error! Status: ${response.status}`);
    //                 }

    //                 await response.json();
    //                 toast('Accessori aggiornati')
    //                 //console.log('Success:', data);
    //             } catch (error) {
    //                 console.error('Fetch error:', error);
    //             }
    //         }
    //     }
    //     updateCar();

    // }, [accessori]);

    return (
        <>
            <Toaster />
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-2 mt-5">
                <div className="rounded-2xl border border-slate-200">
                    <div className="bg-slate-200 rounded-b rounded-2xl p-4 text-slate-800 font-light">
                        Accessori
                    </div>
                    <div className="p-4">
                        <p className="mb-1 font-light">Cerca accessorio</p>
                        <input
                            className="font-light rounded-xl border bg-slate-200 border-slate-100 p-2 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 p-4 gap-2">
                        {Object.entries(accessori)
                            .filter(([key]) => key !== 'immagini' && (search == '' ? true : mappedKeys[key].toLowerCase().includes(search.toLowerCase())))
                            .map(([key, value]) => (
                                <span
                                    className={`p-2 ${value ? 'bg-green-400' : 'bg-red-400'} rounded-2xl cursor-pointer`}
                                    key={key}
                                    onClick={() => setAccessori((prevState: any) => ({ ...prevState, [key]: !value }))}
                                >
                                    {mappedKeys[key]}
                                </span>
                            ))}
                    </div>
                </div>
            </div >
        </>
    );
}
