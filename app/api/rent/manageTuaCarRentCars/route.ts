import { NextResponse } from "next/server";
import axios from "axios";
import getAgencyByDescription from "../../agencies/_actions/getAgencyByDescription";
import addCarToRent from "../_actions/addCarToRent";
import { getRentCarByRent4YouId } from "../_actions/getRentCarByRent4YouId";
import { getRentCarByERPId } from "../_actions/getRentCarByERPId";
import { getRentCarsFromERP } from "../_actions/getRentCarsFromERP";
import { updateRentCar } from "../_actions/updateRentCar";

interface Rent4YouCar {
    marca: string | null
    modello: string | null
    prezzoDiListino: number | null
    allestimento: string | null
    urlImmagineMarca: string | null
    id: number
    description: string | null
    caratteristichePrincipaliAuto: {
        porte: string | null
        cambio: string | null
        motore: string | null
        anno: string | null
        potenza: string | null
    }
    miglioreOfferta: {
        kilometri: string | null
    }
}

async function updateProduct(productId: any, updatedProduct: object) {
    try {
        const response = await axios.put(`${process.env.WS_BASE_URL}wp-json/wc/v3/products/${productId}`, updatedProduct, {
            auth: {
                username: process.env.WS_CONSUMER_KEY ? process.env.WS_CONSUMER_KEY : "",
                password: process.env.WS_CONSUMER_SECRET ? process.env.WS_CONSUMER_SECRET : ""
            }
        });
        console.log('Prodotto aggiornato con successo:', response.data);
    } catch (error) {
        console.error('Errore durante l\'aggiornamento del prodotto:');
    }
}

async function addProduct(productData: any) {
    try {
        const response = await axios.post(`${process.env.WS_BASE_URL}wp-json/wc/v3/products`, productData, {
            auth: {
                username: process.env.WS_CONSUMER_KEY ? process.env.WS_CONSUMER_KEY : "",
                password: process.env.WS_CONSUMER_SECRET ? process.env.WS_CONSUMER_SECRET : ""
            }
        });
        await updateProduct(response.data.id, productData);
        return response.data.id
    } catch (error) {
        console.error('Errore durante l\'aggiunta del prodotto:');
        return null
    }
}

async function deleteProduct(productId: string) {
    try {
        await axios.delete(`${process.env.WS_BASE_URL}wp-json/wc/v3/products/${productId}`, {
            auth: {
                username: process.env.WS_CONSUMER_KEY ? process.env.WS_CONSUMER_KEY : "",
                password: process.env.WS_CONSUMER_SECRET ? process.env.WS_CONSUMER_SECRET : ""
            }
        });
        return true
    } catch (error) {
        console.error('Errore durante l\'eliminazione del prodotto:');
    }
}

async function getProducts(productId: string) {
    try {
        const response = await axios.get(`${process.env.WS_BASE_URL}wp-json/wc/v3/products/${productId}`, {
            auth: {
                username: process.env.WS_CONSUMER_KEY ? process.env.WS_CONSUMER_KEY : "",
                password: process.env.WS_CONSUMER_SECRET ? process.env.WS_CONSUMER_SECRET : ""
            }
        });
        return response.data
    } catch (error) {
        console.error('Nessun prodotto trovato');
    }
}

async function getAllProducts() {
    try {
        const response = await axios.get(`${process.env.WS_BASE_URL}wp-json/wc/v3/products/`, {
            auth: {
                username: process.env.WS_CONSUMER_KEY ? process.env.WS_CONSUMER_KEY : "",
                password: process.env.WS_CONSUMER_SECRET ? process.env.WS_CONSUMER_SECRET : ""
            }
        });
        return response.data
    } catch (error) {
        console.error('Nessun prodotto trovato!');
    }
}

/* VERSIONE CHE CONFERMA DATE E LE AGGIORNA!
async function confirmRent(productId: string, bookingId: string, fromDate: string, toDate: string) {
    let product = await getProducts(productId)
    console.log("PRODUCT ID: ", productId)
    console.log("BOOKING ID: ", bookingId)
    //console.log("CONFIRM FOUND PRODUCT: ", product)
    console.log("FROM: ", fromDate)
    console.log("TO: ", toDate)

    const newDateInterval = {
        'type': 'custom',
        'bookable': 'no',
        'priority': 1,
        'from': fromDate.split("T")[0],
        'to': toDate.split("T")[1]
    };

    const bookingAvailabilityMeta = product.meta_data.find(meta => meta.key === '_wc_booking_availability');

    // Check if bookingAvailabilityMeta exists and has a value array
    if (bookingAvailabilityMeta && Array.isArray(bookingAvailabilityMeta.value)) {
        // Add the new date interval to the value array
        bookingAvailabilityMeta.value.push(newDateInterval);
    } else {
        // If _wc_booking_availability doesn't exist or doesn't have a value array, initialize it
        product.meta_data.push({
            key: "_wc_booking_availability",
            value: [newDateInterval]
        });
    }

    //console.log("bookingAvailabilityMeta: ", bookingAvailabilityMeta)

    //console.log("UPDATED PRODUCT! ", product)

    const newProductMetaData = {
        meta_data: product.meta_data
    };

    console.log("TO UPDATE: ", newProductMetaData)

    await updateProduct(productId, newProductMetaData)

}
*/

/*
function extractImageName(url: string) {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    return fileName.split('.')[0]; // Assuming the file name format is 'image1.jpg'
}
*/

export async function POST(request: Request) {
    const req = await request.json();

    const action = req['action']
    const productId = req['productId']
    const bookingId = req['bookingId']
    const fromDate = req['fromDate']
    const toDate = req['toDate']

    if (action == 'getAll') {
        const allCars = await getAllProducts()
        console.log(allCars)
    }

    if (action == "get") {
        const res = await getProducts(productId)
        res.meta_data.forEach((item: any) => {
            console.log(item);
        });
    }

    if (action == "delete") {
        await deleteProduct(productId)
    }

    if (action == "confirm") {
        try {
            const response = await axios.post(`${process.env.WS_BASE_URL}wp-json/custom/v1/confirm-booking/${bookingId}`, null, {
                auth: {
                    username: process.env.WS_BOOKING_USERNAME ? process.env.WS_BOOKING_USERNAME : "",
                    password: process.env.WS_BOOKING_PSW ? process.env.WS_BOOKING_PSW : ""
                }
            });
            console.log('Rent confermato!:', response.data);
        } catch (error) {
            console.error('Errore durante l\'aggiornamento del prodotto:');
        }
    }

    if (action == "annulla") {
        try {
            const response = await axios.post(`${process.env.WS_BASE_URL}wp-json/custom/v1/cancel-booking/${bookingId}`, null, {
                auth: {
                    username: process.env.WS_BOOKING_USERNAME ? process.env.WS_BOOKING_USERNAME : "",
                    password: process.env.WS_BOOKING_PSW ? process.env.WS_BOOKING_PSW : ""
                }
            });
            console.log('Rent annullato!:', response.data);
        } catch (error) {
            console.error('Errore durante l\'aggiornamento del prodotto:');
        }
    }

    if (action == "update") {
        const newAvailability = [
            {
                type: "custom",
                bookable: true,
                priority: 10,
                from: "2024-06-18",
                to: "2024-06-20",
                from_range: "10:00",
                to_range: "18:00"
            }
        ];

        const testUpdate =
        {
            key: "_wc_booking_availability",
            value: JSON.stringify(newAvailability)
        }

        await updateProduct(productId, testUpdate)
    }

    if (action == "synch") {
        console.log("SYNCH")
        const rentCarsERP = await getRentCarsFromERP();

        //console.log(rentCarsERP[0])

        const ok = true
        if (ok) {
            for (const rc of rentCarsERP) {

                const findAgency = await getAgencyByDescription(rc.agenzia.description)
                const agencyCode = findAgency.code ? findAgency.code : ""

                console.log("FOUND AGENCY CODE: ", agencyCode)

                //const images = rc.pictures.map(extractImageName).join('|');

                //console.log("RENT CAR IMAGES: ", images)

                //console.log("IMAGE: ", rc.pictureToPublishUrl.split('?')[0].length == 0 ? "" : rc.pictureToPublishUrl.split('?')[0]+"|")

                //console.log("images: ", images)

                const newProductData = {
                    name: rc.make + " " + rc.model,
                    status: "publish",
                    type: "simple", //inserisci simple, in backend lo IO cambio a booking
                    description: "",
                    meta_data: [
                        //dati per il veicolo a noleggio
                        { key: "booking", value: "true" },
                        { key: "tipologie-noleggio", value: "noleggio-breve" }, //nel caso in cui sia noleggio breve termine
                        // { key: "tipologie-noleggio", value: "noleggio-lungo" },// nel caso in cui sia noleggio lungo termine
                        { key: "costo_base", value: "" }, // costo base
                        { key: "costo_blocco", value: rc.price }, // costo blocco (settato a 1 giorno)
                        { key: "durata_massima_prenotazione", value: 30 }, // durata massima prenotazione noleggio

                        // intervalli di disponibilità
                        {
                            key: "_wc_booking_availability", value:
                                [
                                    //type: sempre custom
                                    //bookable: indica se quell'intervallo è prenotabile o no
                                    //from e to: date inizio e fine intervallo
                                    //ATTENZIONE: tutte le date sono sempre disponibili quindi in teoria basta aggingere solo gli intervalli dove 'bookable': 'no'
                                    // inoltre è possibile anche aggiungere 'priority': 1-10 se serve...
                                    /*
                                    { 'type': 'custom', 'bookable': 'no', 'priority': 10, 'from': '2024-04-25', 'to': '2024-05-05' },
                                    { 'type': 'custom', 'bookable': 'yes', 'priority': 10, 'from': '2024-05-05', 'to': '2024-05-15' },
                                    { 'type': 'custom', 'bookable': 'yes', 'priority': 10, 'from': '2024-05-15', 'to': '2024-05-30' },
                                    { 'type': 'custom', 'bookable': 'no', 'priority': 10, 'from': '2024-06-05', 'to': '2024-06-30' }
                                    */
                                ]
                        },
                        {
                            key: "_wc_booking_pricing", value:
                                [
                                    {}, //NEL CASO IN CUI ALCUNI GIORNI LE AUTO POSSANO COSTARE DI PIÙ RISPETTO ALTRI GIORNI, PER ORA NON PENSO SERVA
                                ]
                        },

                        //classici dati del veicolo in vendita
                        {
                            key: "fifu_list_url", //LISTA IMMAGINI
                            // value: "linkimg1|linkimg2|linkimg3|"
                            //value: images+"|",
                            value: rc.pictureToPublishUrl.split('?')[0].length == 0 ? "" : rc.pictureToPublishUrl.split('?')[0] + "|"
                        },
                        {
                            key: "id_crm", //id del veicolo che corrisponde a quello del CRM (di Milan, almeno era così per le auto in vendita)
                            value: rc.id  //esempio: 661a4ef6db337da2d4b97594 lo ottieni da Gabriele Milan, vero?
                            // se provi ad inserirlo doppio ti arriva errore 'Il valore "id_crm" non è univoco. Impossibile inserire il prodotto.'
                            // avevamo deciso così con Gabriele Milan
                            // se usi un id tuo ho paura che ci sia la remota possibilità che si sovrapponga con uno suo... non so come siete organizzati
                        },
                        {
                            key: "prezzo_finale_veicolo",
                            value: rc.price //non serve ?? è il corrisponderebbe al prezzo del veicolo(mostrato solo in front-end) --> chiedere a Tania
                        },
                        {
                            key: "e-mail_agenzia",
                            value: findAgency.email // email agenzia
                        },
                        {
                            key: "marca",
                            value: rc.make
                        },
                        {
                            key: "marca_meta",
                            value: rc.make
                        },
                        {
                            key: "modello",
                            value: rc.model
                        },
                        {
                            key: "modello_meta",
                            value: rc.model
                        },
                        {
                            key: "allestimento",
                            value: rc.engine
                        },
                        {
                            key: "annomese_immatricolazione",
                            value: rc.registrationDate.split('-')[1] + "-" + rc.registrationDate.split('-')[0]
                        },
                        {
                            key: "km",
                            value: rc.km
                        },
                        {
                            key: "kilowatt",
                            value: ""
                        },
                        {
                            key: "cavalli",
                            value: ""
                        },
                        {
                            key: "cilindrata",
                            value: ""
                        },
                        {
                            key: "tipologia_veicolo",
                            value: ""
                        },
                        {
                            key: "classe_euro", //la usiamo nel caso del rent per salvare l'indirizzo dell'agenzia. Nel rent questo valore non ci serve.
                            value: findAgency.indirizzo
                        },
                        {
                            key: "colore_veicolo",
                            value: rc.colore.description
                        },
                        {
                            key: "porte",
                            value: ""
                        },
                        {
                            key: "alimentazione",
                            value: rc.fuel.description
                        },
                        {
                            key: "cambio",
                            value: rc.gearboxType.name
                        },
                        {
                            key: "posti",
                            value: ""
                        },
                        {
                            key: "cat_patente",
                            value: ""
                        },
                        {
                            key: "trazione",
                            value: ""
                        },
                        {
                            key: "numero_di_proprietari",
                            value: ""
                        },
                        {
                            key: "accessori",
                            value: ""
                        },
                        {
                            key: "link_youtube",
                            value: ""
                        },
                        {
                            key: "wa_dellagenzia_referente",
                            value: findAgency.telefono?.replace("+39", "")
                        },
                        {
                            key: "sede_dellagenzia_meta",
                            value: rc.agenzia.description //esempio "TuaCar Torino 1" 
                            // OCCHIO CHE SE METTI L'AGENZIA PER UN TEST COMPARE ANCHE NEL PARCO AUTO PUBBLICO DI QUELLA AGENZIA
                        }
                    ],
                    attributes: [
                        {
                            name: "Marca",
                            position: 0,
                            visible: true,
                            variation: false,
                            options: [rc.make], //INSERISCI LA MARCA... vanno negli attributi richiesti da Tania
                        },
                        {
                            name: "Modello",
                            position: 1,
                            visible: true,
                            variation: false,
                            options: [rc.model], //INSERISCI IL MODELLO...  vanno negli attributi richiesti da Tania
                        },

                    ],

                };

                const rentCarExist = await getRentCarByERPId(rc.id)
                //se l'auto non è presente sul db allora aggiungila
                //const rentCarExist = true
                if (!rentCarExist) {
                    console.log("Aggiungi nuova")
                    const carId = await addProduct(newProductData)
                    //otteniamo l'id del prodotto Wordpress. A questo punto dobbiamo salvare l'auto nel nostro Database per poter associare correttamente l'id all'ERPId.
                    if (carId) {
                        const newRentCar = {
                            //id: null,
                            erpId: rc.id,
                            wordpressId: carId.toString(),
                            rentType: "breve",
                            agencyCode: agencyCode,
                            make: rc.make,
                            model: rc.model,
                            mileage: rc.km,
                            engine: rc.engine,
                            fuelType: rc.fuel.description,
                            gearBox: rc.gearboxType.name,
                            color: rc.colore.description,
                            powerKw: 0,
                            powerCv: 0,
                            plate: rc.targa,
                            //createdAt: null
                        }
                        const newRentCarId = await addCarToRent({
                            carsToRent: newRentCar
                        })
                        if (newRentCarId) {
                            console.log("Auto aggiunta correttamente sia su DB che su Wordpress")
                        } else {
                            console.log("Qualcosa è andato storto! Stiamo eliminando anche l'auto da Wordpress")
                            await deleteProduct(carId.toString())
                        }
                    }
                } else {
                    console.log("CAR ALREADY EXIST IN RENT, UPDATE DETAILS")
                    try {
                        const updatedRentCar = {
                            //id: null,
                            erpId: rc.id,
                            rentType: "breve",
                            agencyCode: agencyCode,
                            make: rc.make,
                            model: rc.model,
                            mileage: rc.km,
                            engine: rc.engine,
                            fuelType: rc.fuel.description,
                            gearBox: rc.gearboxType.name,
                            color: rc.colore.description,
                            powerKw: 0,
                            powerCv: 0,
                            plate: rc.targa,
                            //createdAt: null
                        }
                        await updateRentCar(updatedRentCar, rc.id)

                        //AGGIORNA ANCHE SU WORDPRESS!
                        const wpUpdatedCar = {
                            name: rc.make + " " + rc.model,
                            status: "publish",
                            type: "simple", //inserisci simple, in backend lo IO cambio a booking
                            description: "",
                            meta_data: [
                                //dati per il veicolo a noleggio
                                { key: "booking", value: "true" },
                                { key: "tipologie-noleggio", value: "noleggio-breve" }, //nel caso in cui sia noleggio breve termine
                                // { key: "tipologie-noleggio", value: "noleggio-lungo" },// nel caso in cui sia noleggio lungo termine
                                { key: "costo_base", value: "" }, // costo base
                                { key: "costo_blocco", value: rc.price }, // costo blocco (settato a 1 giorno)
                                { key: "durata_massima_prenotazione", value: 30 },
                                //classici dati del veicolo in vendita
                                {
                                    key: "fifu_list_url", //LISTA IMMAGINI
                                    // value: "linkimg1|linkimg2|linkimg3|"
                                    //value: images+"|",
                                    value: rc.pictureToPublishUrl.split('?')[0].length == 0 ? "" : rc.pictureToPublishUrl.split('?')[0] + "|"
                                },
                                {
                                    key: "id_crm", //id del veicolo che corrisponde a quello del CRM (di Milan, almeno era così per le auto in vendita)
                                    value: rc.id  //esempio: 661a4ef6db337da2d4b97594 lo ottieni da Gabriele Milan, vero?
                                    // se provi ad inserirlo doppio ti arriva errore 'Il valore "id_crm" non è univoco. Impossibile inserire il prodotto.'
                                    // avevamo deciso così con Gabriele Milan
                                    // se usi un id tuo ho paura che ci sia la remota possibilità che si sovrapponga con uno suo... non so come siete organizzati
                                },
                                {
                                    key: "prezzo_finale_veicolo",
                                    value: rc.price //non serve ?? è il corrisponderebbe al prezzo del veicolo(mostrato solo in front-end) --> chiedere a Tania
                                },
                                {
                                    key: "e-mail_agenzia",
                                    value: findAgency.email // email agenzia
                                },
                                {
                                    key: "marca",
                                    value: rc.make
                                },
                                {
                                    key: "marca_meta",
                                    value: rc.make
                                },
                                {
                                    key: "modello",
                                    value: rc.model
                                },
                                {
                                    key: "modello_meta",
                                    value: rc.model
                                },
                                {
                                    key: "allestimento",
                                    value: rc.engine
                                },
                                {
                                    key: "annomese_immatricolazione",
                                    value: rc.registrationDate.split('-')[1] + "-" + rc.registrationDate.split('-')[0]
                                },
                                {
                                    key: "km",
                                    value: rc.km
                                },
                                {
                                    key: "kilowatt",
                                    value: ""
                                },
                                {
                                    key: "cavalli",
                                    value: ""
                                },
                                {
                                    key: "cilindrata",
                                    value: ""
                                },
                                {
                                    key: "tipologia_veicolo",
                                    value: ""
                                },
                                {
                                    key: "classe_euro",
                                    value: findAgency.indirizzo
                                },
                                {
                                    key: "colore_veicolo",
                                    value: rc.colore.description
                                },
                                {
                                    key: "porte",
                                    value: ""
                                },
                                {
                                    key: "alimentazione",
                                    value: rc.fuel.description
                                },
                                {
                                    key: "cambio",
                                    value: rc.gearboxType.name
                                },
                                {
                                    key: "posti",
                                    value: ""
                                },
                                {
                                    key: "cat_patente",
                                    value: ""
                                },
                                {
                                    key: "trazione",
                                    value: ""
                                },
                                {
                                    key: "numero_di_proprietari",
                                    value: ""
                                },
                                {
                                    key: "accessori",
                                    value: ""
                                },
                                {
                                    key: "link_youtube",
                                    value: ""
                                },
                                {
                                    key: "wa_dellagenzia_referente",
                                    value: findAgency.telefono?.replace("+39", "")
                                },
                                {
                                    key: "sede_dellagenzia_meta",
                                    value: rc.agenzia.description //esempio "TuaCar Torino 1" 
                                    // OCCHIO CHE SE METTI L'AGENZIA PER UN TEST COMPARE ANCHE NEL PARCO AUTO PUBBLICO DI QUELLA AGENZIA
                                }
                            ],
                            attributes: [
                                {
                                    name: "Marca",
                                    position: 0,
                                    visible: true,
                                    variation: false,
                                    options: [rc.make], //INSERISCI LA MARCA... vanno negli attributi richiesti da Tania
                                },
                                {
                                    name: "Modello",
                                    position: 1,
                                    visible: true,
                                    variation: false,
                                    options: [rc.model], //INSERISCI IL MODELLO...  vanno negli attributi richiesti da Tania
                                },

                            ],

                        };

                        await updateProduct(rentCarExist.wordpressId, wpUpdatedCar)

                        //CONTROLLA ANCHE I NOLEGGI ATTIVI SU ERP PER SINCRONIZZARE IL CALENDARIO!
                        //CI INTERESSANO SOLO DATE FUTURE!

                    } catch (err) {
                        console.log("errore durante l'aggiornamento dell'auto sul Database!: ", err)
                    }
                }
            }
        }
    }

    if (action == "synch-long") {
        console.log("SYNCH LONG")
        let allLongTermCars: any[] = []
        const params = {
            "apiKey": process.env.RENT_4_YOU_API_KEY,
            "catalogoId": 5,
            "listinoId": 10,
            "dimensioneImmagine": 125,
            "orientamentoImmagine": '["125", "125"]',
            "anticipoZero": true,
            "aliquotaIva": 0
        };
        const options = {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
                "Accept": "text/plain",
                "Content-Type": "application/json"
            }
        };
        await fetch("https://api.rent4business.it/v1/veicoli", options)
            .then((res) => res.json())
            .then((data) => {
                allLongTermCars = data
            })

        const ok = true
        if (ok) {
            for (const rc of allLongTermCars) {
                console.log("ok")
                let currentCar: Rent4YouCar = {
                    marca: null,
                    modello: null,
                    prezzoDiListino: null,
                    allestimento: null,
                    description: null,
                    caratteristichePrincipaliAuto: {
                        porte: null,
                        cambio: null,
                        motore: null,
                        anno: null,
                        potenza: null
                    },
                    urlImmagineMarca: null,
                    id: 0,
                    miglioreOfferta: {
                        kilometri: null,
                    }
                }
                //GET DETTAGLI VEICOLO
                const params = {
                    "apiKey": process.env.RENT_4_YOU_API_KEY,
                    "veicoloId": rc.id,
                    "listinoId": 45,
                    "dimensioneImmagine": 125,
                    "orientamentoImmagine": '["125", "125"]',
                    "anticipoZero": true,
                    "aliquotaIva": 0
                };
                const options = {
                    method: "POST",
                    body: JSON.stringify(params),
                    headers: {
                        "Accept": "text/plain",
                        "Content-Type": "application/json"
                    }
                };
                try {
                await fetch("https://api.rent4business.it/v1/veicolo", options)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log("current car: ", data)
                        currentCar = data
                    })
                } catch (err) {
                    console.log("error: ", err)
                }

                const newProductData = {
                    name: currentCar.marca + " " + currentCar.modello,
                    status: "publish",
                    type: "simple", //inserisci simple, in backend lo IO cambio a booking
                    description: currentCar.description,
                    meta_data: [
                        //dati per il veicolo a noleggio
                        { key: "booking", value: "true" },
                        { key: "tipologie-noleggio", value: "noleggio-lungo" }, //nel caso in cui sia noleggio breve termine
                        // { key: "tipologie-noleggio", value: "noleggio-lungo" },// nel caso in cui sia noleggio lungo termine
                        { key: "costo_base", value: currentCar.prezzoDiListino }, // costo base
                        { key: "costo_blocco", value: "" }, // costo blocco (settato a 1 giorno)
                        { key: "durata_massima_prenotazione", value: 14 }, // durata massima prenotazione noleggio

                        // intervalli di disponibilità
                        {
                            key: "_wc_booking_availability", value:
                                [
                                    //type: sempre custom
                                    //bookable: indica se quell'intervallo è prenotabile o no
                                    //from e to: date inizio e fine intervallo
                                    //ATTENZIONE: tutte le date sono sempre disponibili quindi in teoria basta aggingere solo gli intervalli dove 'bookable': 'no'
                                    // inoltre è possibile anche aggiungere 'priority': 1-10 se serve...
                                    /*
                                    { 'type': 'custom', 'bookable': 'no', 'priority': 10, 'from': '2024-04-25', 'to': '2024-05-05' },
                                    { 'type': 'custom', 'bookable': 'yes', 'priority': 10, 'from': '2024-05-05', 'to': '2024-05-15' },
                                    { 'type': 'custom', 'bookable': 'yes', 'priority': 10, 'from': '2024-05-15', 'to': '2024-05-30' },
                                    { 'type': 'custom', 'bookable': 'no', 'priority': 10, 'from': '2024-06-05', 'to': '2024-06-30' }
                                    */
                                ]
                        },
                        {
                            key: "_wc_booking_pricing", value:
                                [
                                    {}, //NEL CASO IN CUI ALCUNI GIORNI LE AUTO POSSANO COSTARE DI PIÙ RISPETTO ALTRI GIORNI, PER ORA NON PENSO SERVA
                                ]
                        },

                        //classici dati del veicolo in vendita
                        {
                            key: "fifu_list_url", //LISTA IMMAGINI
                            // value: "linkimg1|linkimg2|linkimg3|"
                            //value: images+"|",
                            value: currentCar.urlImmagineMarca
                        },
                        {
                            key: "id_crm", //id del veicolo che corrisponde a quello del CRM (di Milan, almeno era così per le auto in vendita)
                            value: currentCar.id  //esempio: 661a4ef6db337da2d4b97594 lo ottieni da Gabriele Milan, vero?
                            // se provi ad inserirlo doppio ti arriva errore 'Il valore "id_crm" non è univoco. Impossibile inserire il prodotto.'
                            // avevamo deciso così con Gabriele Milan
                            // se usi un id tuo ho paura che ci sia la remota possibilità che si sovrapponga con uno suo... non so come siete organizzati
                        },
                        {
                            key: "prezzo_finale_veicolo",
                            value: currentCar.prezzoDiListino //non serve ?? è il corrisponderebbe al prezzo del veicolo(mostrato solo in front-end) --> chiedere a Tania
                        },
                        {
                            key: "e-mail_agenzia",
                            value: "" // email agenzia
                        },
                        {
                            key: "marca",
                            value: currentCar.marca
                        },
                        {
                            key: "marca_meta",
                            value: currentCar.marca
                        },
                        {
                            key: "modello",
                            value: currentCar.modello
                        },
                        {
                            key: "modello_meta",
                            value: currentCar.modello
                        },
                        {
                            key: "allestimento",
                            value: currentCar.allestimento
                        },
                        {
                            key: "annomese_immatricolazione",
                            value: currentCar.caratteristichePrincipaliAuto.anno
                        },
                        {
                            key: "km",
                            value: currentCar.miglioreOfferta.kilometri
                        },
                        {
                            key: "kilowatt",
                            value: ""
                        },
                        {
                            key: "cavalli",
                            value: currentCar.caratteristichePrincipaliAuto.potenza
                        },
                        {
                            key: "cilindrata",
                            value: ""
                        },
                        {
                            key: "tipologia_veicolo",
                            value: ""
                        },
                        {
                            key: "classe_euro", //la usiamo nel caso del rent per salvare l'indirizzo dell'agenzia. Nel rent questo valore non ci serve.
                            value: ""
                        },
                        {
                            key: "colore_veicolo",
                            value: ""
                        },
                        {
                            key: "porte",
                            value: currentCar.caratteristichePrincipaliAuto.porte
                        },
                        {
                            key: "alimentazione",
                            value: currentCar.caratteristichePrincipaliAuto.motore
                        },
                        {
                            key: "cambio",
                            value: currentCar.caratteristichePrincipaliAuto.cambio
                        },
                        {
                            key: "posti",
                            value: ""
                        },
                        {
                            key: "cat_patente",
                            value: ""
                        },
                        {
                            key: "trazione",
                            value: ""
                        },
                        {
                            key: "numero_di_proprietari",
                            value: ""
                        },
                        {
                            key: "accessori",
                            value: ""
                        },
                        {
                            key: "link_youtube",
                            value: ""
                        },
                        {
                            key: "wa_dellagenzia_referente",
                            value: ""
                        },
                        {
                            key: "sede_dellagenzia_meta",
                            value: "" //esempio "TuaCar Torino 1" 
                            // OCCHIO CHE SE METTI L'AGENZIA PER UN TEST COMPARE ANCHE NEL PARCO AUTO PUBBLICO DI QUELLA AGENZIA
                        }
                    ],
                    attributes: [
                        {
                            name: "Marca",
                            position: 0,
                            visible: true,
                            variation: false,
                            options: [currentCar.marca], //INSERISCI LA MARCA... vanno negli attributi richiesti da Tania
                        },
                        {
                            name: "Modello",
                            position: 1,
                            visible: true,
                            variation: false,
                            options: [currentCar.modello], //INSERISCI IL MODELLO...  vanno negli attributi richiesti da Tania
                        },

                    ],

                };

                const rentCarExist = await getRentCarByRent4YouId(currentCar.id.toString()) //AGGIUNGERE FIELD IN DATABASE E FUNZIONNE IN RENT/_ACTIONS
                //se l'auto non è presente sul db allora aggiungila
                //const rentCarExist = true
                if (!rentCarExist) {
                    console.log("Aggiungi nuova")
                    const carId = await addProduct(newProductData)
                    //otteniamo l'id del prodotto Wordpress. A questo punto dobbiamo salvare l'auto nel nostro Database per poter associare correttamente l'id all'ERPId.
                    if (carId) {
                        const newRentCar = {
                            //id: null,
                            erpId: currentCar.id,
                            wordpressId: carId.toString(),
                            rentType: "lungo",
                            agencyCode: "",
                            make: currentCar.marca,
                            model: currentCar.modello,
                            mileage: currentCar.miglioreOfferta.kilometri,
                            engine: currentCar.caratteristichePrincipaliAuto.motore,
                            fuelType: currentCar.caratteristichePrincipaliAuto.motore,
                            gearBox: currentCar.caratteristichePrincipaliAuto.cambio,
                            color: "",
                            powerKw: 0,
                            powerCv: currentCar.caratteristichePrincipaliAuto.potenza,
                            plate: ""
                            //createdAt: null
                        }
                        const newRentCarId = await addCarToRent({
                            carsToRent: newRentCar
                        })
                        if (newRentCarId) {
                            console.log("Auto aggiunta correttamente sia su DB che su Wordpress")
                        } else {
                            console.log("Qualcosa è andato storto! Stiamo eliminando anche l'auto da Wordpress")
                            await deleteProduct(carId.toString())
                        }
                    }
                } else {
                    console.log("CAR ALREADY EXIST IN RENT, UPDATE DETAILS")
                    try {
                        const updatedRentCar = {
                            //id: null,
                            erpId: currentCar.id,
                            rentType: "lungo",
                            agencyCode: "",
                            make: currentCar.marca,
                            model: currentCar.modello,
                            mileage: currentCar.miglioreOfferta.kilometri,
                            engine: currentCar.caratteristichePrincipaliAuto.motore,
                            fuelType: currentCar.caratteristichePrincipaliAuto.motore,
                            gearBox: currentCar.caratteristichePrincipaliAuto.cambio,
                            color: "",
                            powerKw: 0,
                            powerCv: currentCar.caratteristichePrincipaliAuto.potenza,
                            plate: ""
                            //createdAt: null
                        }
                        await updateRentCar(updatedRentCar, currentCar.id as any)

                        //AGGIORNA ANCHE SU WORDPRESS!
                        const wpUpdatedCar = {
                            name: currentCar.marca + " " + currentCar.modello,
                            status: "publish",
                            type: "simple", //inserisci simple, in backend lo IO cambio a booking
                            description: currentCar.description,
                            meta_data: [
                                //dati per il veicolo a noleggio
                                { key: "booking", value: "true" },
                                { key: "tipologie-noleggio", value: "noleggio-lungo" }, //nel caso in cui sia noleggio breve termine
                                // { key: "tipologie-noleggio", value: "noleggio-lungo" },// nel caso in cui sia noleggio lungo termine
                                { key: "costo_base", value: currentCar.prezzoDiListino }, // costo base
                                { key: "costo_blocco", value: "" }, // costo blocco (settato a 1 giorno)
                                { key: "durata_massima_prenotazione", value: 14 }, // durata massima prenotazione noleggio

                                // intervalli di disponibilità
                                {
                                    key: "_wc_booking_availability", value:
                                        [
                                            //type: sempre custom
                                            //bookable: indica se quell'intervallo è prenotabile o no
                                            //from e to: date inizio e fine intervallo
                                            //ATTENZIONE: tutte le date sono sempre disponibili quindi in teoria basta aggingere solo gli intervalli dove 'bookable': 'no'
                                            // inoltre è possibile anche aggiungere 'priority': 1-10 se serve...
                                            /*
                                            { 'type': 'custom', 'bookable': 'no', 'priority': 10, 'from': '2024-04-25', 'to': '2024-05-05' },
                                            { 'type': 'custom', 'bookable': 'yes', 'priority': 10, 'from': '2024-05-05', 'to': '2024-05-15' },
                                            { 'type': 'custom', 'bookable': 'yes', 'priority': 10, 'from': '2024-05-15', 'to': '2024-05-30' },
                                            { 'type': 'custom', 'bookable': 'no', 'priority': 10, 'from': '2024-06-05', 'to': '2024-06-30' }
                                            */
                                        ]
                                },
                                {
                                    key: "_wc_booking_pricing", value:
                                        [
                                            {}, //NEL CASO IN CUI ALCUNI GIORNI LE AUTO POSSANO COSTARE DI PIÙ RISPETTO ALTRI GIORNI, PER ORA NON PENSO SERVA
                                        ]
                                },

                                //classici dati del veicolo in vendita
                                {
                                    key: "fifu_list_url", //LISTA IMMAGINI
                                    // value: "linkimg1|linkimg2|linkimg3|"
                                    //value: images+"|",
                                    value: currentCar.urlImmagineMarca
                                },
                                {
                                    key: "id_crm", //id del veicolo che corrisponde a quello del CRM (di Milan, almeno era così per le auto in vendita)
                                    value: currentCar.id  //esempio: 661a4ef6db337da2d4b97594 lo ottieni da Gabriele Milan, vero?
                                    // se provi ad inserirlo doppio ti arriva errore 'Il valore "id_crm" non è univoco. Impossibile inserire il prodotto.'
                                    // avevamo deciso così con Gabriele Milan
                                    // se usi un id tuo ho paura che ci sia la remota possibilità che si sovrapponga con uno suo... non so come siete organizzati
                                },
                                {
                                    key: "prezzo_finale_veicolo",
                                    value: currentCar.prezzoDiListino //non serve ?? è il corrisponderebbe al prezzo del veicolo(mostrato solo in front-end) --> chiedere a Tania
                                },
                                {
                                    key: "e-mail_agenzia",
                                    value: "" // email agenzia
                                },
                                {
                                    key: "marca",
                                    value: currentCar.marca
                                },
                                {
                                    key: "marca_meta",
                                    value: currentCar.marca
                                },
                                {
                                    key: "modello",
                                    value: currentCar.modello
                                },
                                {
                                    key: "modello_meta",
                                    value: currentCar.modello
                                },
                                {
                                    key: "allestimento",
                                    value: currentCar.allestimento
                                },
                                {
                                    key: "annomese_immatricolazione",
                                    value: currentCar.caratteristichePrincipaliAuto.anno
                                },
                                {
                                    key: "km",
                                    value: currentCar.miglioreOfferta.kilometri
                                },
                                {
                                    key: "kilowatt",
                                    value: ""
                                },
                                {
                                    key: "cavalli",
                                    value: currentCar.caratteristichePrincipaliAuto.potenza
                                },
                                {
                                    key: "cilindrata",
                                    value: ""
                                },
                                {
                                    key: "tipologia_veicolo",
                                    value: ""
                                },
                                {
                                    key: "classe_euro", //la usiamo nel caso del rent per salvare l'indirizzo dell'agenzia. Nel rent questo valore non ci serve.
                                    value: ""
                                },
                                {
                                    key: "colore_veicolo",
                                    value: ""
                                },
                                {
                                    key: "porte",
                                    value: currentCar.caratteristichePrincipaliAuto.porte
                                },
                                {
                                    key: "alimentazione",
                                    value: currentCar.caratteristichePrincipaliAuto.motore
                                },
                                {
                                    key: "cambio",
                                    value: currentCar.caratteristichePrincipaliAuto.cambio
                                },
                                {
                                    key: "posti",
                                    value: ""
                                },
                                {
                                    key: "cat_patente",
                                    value: ""
                                },
                                {
                                    key: "trazione",
                                    value: ""
                                },
                                {
                                    key: "numero_di_proprietari",
                                    value: ""
                                },
                                {
                                    key: "accessori",
                                    value: ""
                                },
                                {
                                    key: "link_youtube",
                                    value: ""
                                },
                                {
                                    key: "wa_dellagenzia_referente",
                                    value: ""
                                },
                                {
                                    key: "sede_dellagenzia_meta",
                                    value: "" //esempio "TuaCar Torino 1" 
                                    // OCCHIO CHE SE METTI L'AGENZIA PER UN TEST COMPARE ANCHE NEL PARCO AUTO PUBBLICO DI QUELLA AGENZIA
                                }
                            ],
                            attributes: [
                                {
                                    name: "Marca",
                                    position: 0,
                                    visible: true,
                                    variation: false,
                                    options: [currentCar.marca], //INSERISCI LA MARCA... vanno negli attributi richiesti da Tania
                                },
                                {
                                    name: "Modello",
                                    position: 1,
                                    visible: true,
                                    variation: false,
                                    options: [currentCar.modello], //INSERISCI IL MODELLO...  vanno negli attributi richiesti da Tania
                                },

                            ],

                        };

                        await updateProduct(rentCarExist.wordpressId, wpUpdatedCar)

                        //CONTROLLA ANCHE I NOLEGGI ATTIVI SU ERP PER SINCRONIZZARE IL CALENDARIO!
                        //CI INTERESSANO SOLO DATE FUTURE!

                    } catch (err) {
                        console.log("errore durante l'aggiornamento dell'auto sul Database!: ", err)
                    }
                }
            }
        }
    }

    return NextResponse.json({ status: 200, data: "Success" });
}
