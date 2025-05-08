import pool from '@/lib/db';
import addPerizia from './addPerizia';
import getContactByUserId from '../../contacts/_actions/getContactByUserId';

/*
REST API
payload = {
    "userId": "auth0|6xxxxxxxx", //user id di auth0
    "contact": {
        "name": "", //string,
        "phoneNumber": "", //string,
        "email": "", //string,
        "agencyCode": "" //string,
        "label": "", //potenziale_cliente - potenziale_fornitore
    }
    "car": {
        "tipologia": "garage", //string or null -> ["garage", "annuncio", "both"]
        "status": "in lavorazione",
        "agencyCode": "", //string or null
        "agencyName": "", //string or null
        "targa": "", //string or null
        "km": "", //string or null
        "categoria": "", //stri or nullng
        "marca": "", //string or null
        "modello": "", //string or null
        "immatricolazione": "", //string or null
        "carrozzeria": "", //string or null
        "versione": "", //string or null
        "posti": "", //string or null
        "motore": "", //string or null
        "trazione": "", //string or null
        "trasmissione": "", //string or null
        "allestimento": "", //string or null
        "telaio": "", //string or null
        "condizioni": "", //string or null
        "stato": "", //string or null
        "provenienza": "", //string or null
        "proprietari": "", //string or null
        "garanzia": "", //string or null
        "colore": "", //string or null
        "coloreTipo": "", //string or null
        "pneumatici": "", //string or null
        "pneumaticiUsura": "", //integer or null
        "interni": "", //string or null
        "cerchi": "", //string or null
        "alimentazione": "", //string or null
        "classeEmissione": "", //string or null
        "scadenzaBollo": "", //date or null
        "esenteBollo": "", //boolean or default false
        "scadenzaRevisione": "", //string or null
        "fornitore": "", //string or null
        "neoPatentati": "", //boolean or default false
        "prezzoDiVendita": "", //value like 1000.49 or null
        "prezzoDiRiserva": "", //value like 1000.49 or null
        "immagini": [] // strings array default null
        "accessori": {
            "360camera": "", //boolean or default false
            "airbagPosteriore": "", //booleanor default false
            "appleCarPlay": "", //boolean or default false
            "chiamataAutoSOS": "", //boolean or default false
            "climatizzatore": "", //boolean or default false
            "tractionControl": "", //boolean or default false
            "divisoriBagagliaio": "", //boolean or default false
            "fariDirezionali": "", //boolean or default false
            "frenataAssistita": "", //boolean or default false
            "hillHolder": "", //boolean or default false
            "luciDiurneLed": "", //boolean or default false
            "portellonePostElettrico": "", //boolean or default false
            "riconoscimentoSegnali": "", //boolean or default false
            "sediliMassaggianti": "", //boolean or default false
            "sensoreLuce": "", //boolean or default false
            "servoSterzo": "", //boolean or default false
            "sistemaDiRiconoscimentoStanchezza": "", //boolean or default false
            "soundSystem": "", //boolean or default false
            "telecameraParcheggio": "", //boolean or default false
            "volanteRiscaldabile": "", //boolean or default false
            "handicapFriendly": "", //boolean or default false
            "androidAuto": "", //boolean or default false
            "assistenteAbbaglianti": "", //boolean or default false
            "bracciolo": "", //boolean or default false
            "chiusuraCentralizzataNoKey": "", //boolean or default false
            "climaAuto2Zone": "", //boolean or default false
            "voiceControl": "", //boolean or default false
            "ESP": "", //boolean or default false
            "FariFullLED": "", //boolean or default false
            "frenoStazElettrico": "", //boolean or default false
            "interniInPelle": "", //boolean or default false
            "monitPressionePneumatici": "", //boolean or default false
            "rangeExtender": "", //boolean or default false
            "riscaldamentoAusiliario": "", //boolean or default false
            "sediliRiscaldati": "", //boolean or default false
            "sensorePioggia": "", //boolean or default false
            "sistemaAvvisoDistanza": "", //boolean or default false
            "sistemaVisioneNotturna": "", //boolean or default false
            "specchiettiLatElettrici": "", //boolean or default false
            "tettoApribile": "", //boolean or default false
            "airbag": "", //boolean or default false
            "antifurto": "", //boolean or default false
            "autoradio": "", //boolean or default false
            "caricaInduzioneSmartphone": "", //boolean or default false
            "chiusuraCentralizzataTelecom": "", //boolean or default false
            "climaAuto3Zone": "", //boolean or default false
            "cruiseControl": "", //boolean or default false
            "fariLaser": "", //boolean or default false
            "fariXenon": "", //boolean or default false
            "gancioTraino": "", //boolean or default false
            "isofix": "", //boolean or default false
            "navigatore": "", //boolean or default false
            "regolElettSediliPost": "", //boolean or default false
            "ruotiniScorta": "", //boolean or default false
            "sediliSport": "", //boolean or default false
            "sensoriParcheggioAnt": "", //boolean or default false
            "sistemaCallSOS": "", //boolean or default false
            "sistemaLavafari": "", //boolean or default false
            "speccRetroAntiabbagliamento": "", //boolean or default false
            "tettoPanoramico": "", //boolean or default false
            "airbagLaterali": "", //boolean or default false
            "antifurtoSatell": "", //boolean or default false
            "autoradioDigitale": "", //boolean or default false
            "cerchiInLega": "", //boolean or default false
            "climaAuto4Zone": "", //boolean or default false
            "controlElettCorsia": "", //boolean or default false
            "cruiseControlAdattivo": "", //boolean or default false
            "fariProfonditaAntiabbagliamento": "", //boolean or default false
            "fendiNebbia": "", //boolean or default false
            "headUpDisplay": "", //boolean or default false
            "leveAlVolante": "", //boolean or default false
            "portaScorrLaterale": "", //boolean or default false
            "regolElettSedili": "", //boolean or default false
            "sedilePostSdoppiato": "", //boolean or default false
            "sediliVentilati": "", //boolean or default false
            "sensoriParchPost": "", //boolean or default false
            "sistemaParchAuto": "", //boolean or default false
            "sospensioniPneumatiche": "", //boolean or default false
            "startStopAuto": "", //boolean or default false
            "vetriOscurati": "", //boolean or default false
            
        }
    }
}
*/
export default async function addGarageCar(data: any) {

    const contact: Contact = data.contact

    //GET CONTACT
    const contactExist = await getContactByUserId({
        id: data.userId
    })

    let insertIdContact = "";

    //if (!contactExist) {
    if (true) {
        //ADD CONTATTO SU DB
        const newContact = {
            name: contact.name,
            phoneNumber: contact.phoneNumber,
            email: contact.email,
            userId: data.userId,
            agencyCode: contact.agencyCode,
            label: contact.label, //potenziale_cliente - potenziale_fornitore
            isConfirmed: false,
        };

        const columnsContact = Object.keys(newContact).join(', ');
        const valuesContact = Object.values(newContact)
            .map(value => {
                if (value === null || value === undefined || value === '') {
                    return 'NULL'; // Handle empty, null, or undefined values
                } else if (typeof value === 'string') {
                    return `'${value}'`; // Add single quotes for strings
                } else if (typeof value === 'boolean') {
                    return value ? 1 : 0; // Convert boolean to 1/0 for SQL
                } else {
                    return value; // Numbers or other types are not quoted
                }
            })
            .join(', ');

        const sqlQueryContact = `INSERT INTO contacts (${columnsContact}) VALUES (${valuesContact});`;

        const rowContact: any = await pool.query(sqlQueryContact);

        insertIdContact = rowContact[0].insertId;

        console.log("CONTACT ID: ", insertIdContact)
    } else {
        insertIdContact = contactExist.id
    }

    //ADD CAR NEL GARAGE
    let car = data.car;
    car.contactId = insertIdContact;
    car.userid = data.userId

    const columnsCar = Object.keys(car).join(', ');

    // Serialize the `accessori` field to a JSON string if it exists
    if (car.accessori) {
        car.accessori = JSON.stringify(car.accessori); // Serialize accessori object
    }

    // Map values for the SQL query
    const valuesCar = Object.values(car)
        .map(value => {
            if (value === null || value === undefined || value === '') {
                return 'NULL'; // Handle empty, null, or undefined values
            } else if (typeof value === 'string') {
                return `'${value.replace(/'/g, "''")}'`; // Escape single quotes for strings
            } else if (typeof value === 'boolean') {
                return value ? 1 : 0; // Convert boolean to 1/0 for SQL
            } else {
                return value; // Numbers or other types are not quoted
            }
        })
        .join(', ');

    const sqlQueryCar = `INSERT INTO garage (${columnsCar}) VALUES (${valuesCar});`;


    //ADD PERIZIE
    // Execute the query
    try {
        const [rowCar]: any[] = await pool.query(sqlQueryCar);
        const insertIdCar = rowCar?.insertId;

        //ADD PERIZIA
        const firstPerizia = {
            ...data.perizia,
            garageId: insertIdCar
        };
        const insertIdPerizia = await addPerizia(firstPerizia)

        if (insertIdCar) {
            // Add PERIZIA and DICHIARAZIONE DI CONFORMITA'
            const periziaAndDichiarazione = [
                //{ garageId: insertIdCar, tipo: 'perizia' },
                { garageId: insertIdCar, tipo: 'dichiarazione' }
            ];
            await Promise.all(periziaAndDichiarazione.map(addPerizia));
        }

        return {
            contactId: insertIdContact,
            carId: insertIdCar,
            periziaId: insertIdPerizia
        }

    } catch (error: any) {
        console.error('Error executing query:', error.message);
        throw error
    }

}
