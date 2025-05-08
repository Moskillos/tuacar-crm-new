interface Car {
    status: string, // [’bozza’, ‘in lavorazione’, ‘pubblicato’, ‘rifiutato’]
    pushNotificationToken: string, //string token per l'invio di notifiche push
    inGarage: boolean, //boolean
    userid: string, //string id dell'utente che ha creato l'annuncio
    contactId: string, //string id del contatto associato all'annuncio
    inVendita: boolean, //boolean
    agencyCode: string | null, //string or null
    agencyName: string | null, //string or null
    targa: string | null, //string or null
    km: string | null, //string or null
    categoria: string | null, //string or null
    marca: string | null, //string or null
    modello: string | null, //string or null
    immatricolazione: string | null, //string or null
    carrozzeria: string | null, //string or null
    versione: string | null, //string or null
    posti: string | null, //string or null
    motore: string | null, //string or null
    trazione: string | null, //string or null
    trasmissione: string | null, //string or null
    allestimento: string | null, //string or null
    telaio: string | null, //string or null
    condizioni: string | null, //string or null
    stato: string | null, //string or null
    provenienza: string | null, //string or null
    proprietari: string | null, //string or null
    garanzia: string | null, //string or null
    colore: string | null, //string or null
    coloreTipo: string | null, //string or null
    pneumatici: string | null, //string or null
    pneumaticiUsura: number | null, //integer or null
    interni: string | null, //string or null
    cerchi: string | null, //string or null
    alimentazione: string | null, //string or null
    classeEmissione: string | null, //string or null
    scadenzaBollo: string | null, //date or null
    esenteBollo: boolean, //boolean or default false
    scadenzaRevisione: string | null, //string or null
    fornitore: string | null, //string or null
    neoPatentati: boolean, //boolean or default false
    prezzoDiVendita: number | null, //value like 1000.49 or null
    prezzoDiRiserva: number | null, //value like 1000.49 or null
    immagini: string[] //array or strings default null
    accessori: {
        camera360: boolean, //boolean or default false
        airbagPosteriore: boolean, //booleanor default false
        appleCarPlay: boolean, //boolean or default false
        chiamataAutoSOS: boolean, //boolean or default false
        climatizzatore: boolean, //boolean or default false
        tractionControl: boolean, //boolean or default false
        divisoriBagagliaio: boolean, //boolean or default false
        fariDirezionali: boolean, //boolean or default false
        frenataAssistita: boolean, //boolean or default false
        hillHolder: boolean, //boolean or default false
        luciDiurneLed: boolean, //boolean or default false
        portellonePostElettrico: boolean, //boolean or default false
        riconoscimentoSegnali: boolean, //boolean or default false
        sediliMassaggianti: boolean, //boolean or default false
        sensoreLuce: boolean, //boolean or default false
        servoSterzo: boolean, //boolean or default false
        sistemaDiRiconoscimentoStanchezza: boolean, //boolean or default false
        soundSystem: boolean, //boolean or default false
        telecameraParcheggio: boolean, //boolean or default false
        volanteRiscaldabile: boolean, //boolean or default false
        handicapFriendly: boolean, //boolean or default false
        androidAuto: boolean, //boolean or default false
        assistenteAbbaglianti: boolean, //boolean or default false
        bracciolo: boolean, //boolean or default false
        chiusuraCentralizzataNoKey: boolean, //boolean or default false
        climaAuto2Zone: boolean, //boolean or default false
        voiceControl: boolean, //boolean or default false
        ESP: boolean, //boolean or default false
        FariFullLED: boolean, //boolean or default false
        frenoStazElettrico: boolean, //boolean or default false
        interniInPelle: boolean, //boolean or default false
        monitPressionePneumatici: boolean, //boolean or default false
        rangeExtender: boolean, //boolean or default false
        riscaldamentoAusiliario: boolean, //boolean or default false
        sediliRiscaldati: boolean,
        sensorePioggia: boolean, //boolean or default false
        sistemaAvvisoDistanza: boolean, //boolean or default false
        sistemaVisioneNotturna: boolean, //boolean or default false
        specchiettiLatElettrici: boolean, //boolean or default false
        tettoApribile: boolean, //boolean or default false
        airbag: boolean, //boolean or default false
        antifurto: boolean, //boolean or default false
        autoradio: boolean, //boolean or default false
        caricaInduzioneSmartphone: boolean, //boolean or default false
        chiusuraCentralizzataTelecom: boolean, //boolean or default false
        climaAuto3Zone: boolean, //boolean or default false
        cruiseControl: boolean, //boolean or default false
        fariLaser: boolean, //boolean or default false
        fariXenon: boolean, //boolean or default false
        gancioTraino: boolean, //boolean or default false
        isofix: boolean, //boolean or default false
        navigatore: boolean, //boolean or default false
        regolElettSediliPost: boolean, //boolean or default false
        ruotiniScorta: boolean, //boolean or default false
        sediliSport: boolean, //boolean or default false
        sensoriParcheggioAnt: boolean, //boolean or default false
        sistemaCallSOS: boolean, //boolean or default false
        sistemaLavafari: boolean, //boolean or default false
        speccRetroAntiabbagliamento: boolean, //boolean or default false
        tettoPanoramico: boolean, //boolean or default false
        airbagLaterali: boolean, //boolean or default false
        antifurtoSatell: boolean, //boolean or default false
        autoradioDigitale: boolean, //boolean or default false
        cerchiInLega: boolean, //boolean or default false
        climaAuto4Zone: boolean, //boolean or default false
        controlElettCorsia: boolean, //boolean or default false
        cruiseControlAdattivo: boolean, //boolean or default false
        fariProfonditaAntiabbagliamento: boolean, //boolean or default false
        fendiNebbia: boolean, //boolean or default false
        headUpDisplay: boolean, //boolean or default false
        leveAlVolante: boolean, //boolean or default false
        portaScorrLaterale: boolean, //boolean or default false
        regolElettSedili: boolean, //boolean or default false
        sedilePostSdoppiato: boolean, //boolean or default false
        sediliVentilati: boolean, //boolean or default false
        sensoriParchPost: boolean, //boolean or default false
        sistemaParchAuto: boolean, //boolean or default false
        sospensioniPneumatiche: boolean, //boolean or default false
        startStopAuto: boolean, //boolean or default false
        vetriOscurati: boolean, //boolean or default false        
    },
}

