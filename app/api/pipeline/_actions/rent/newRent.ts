import pool from '@/lib/db';
import getBreveById from './getBreveById';

/*
REQ:  {
  action: 'addBreveTermine',
  deal: {
    userId: 'auth0|650413f55a0affc87201a691',
    stageId: 16,
    title: 'Noleggio: Audi A3',
    value: '0',
    oldNotes: '',
    end: '',
    isAwarded: false,
    createdAt: '',
    contactId: 131647,
    isFailed: false,
    pipelineId: 4,
    agencyCode: 'AGENZIA_002',
    carToBuyId: null,
    carId: null,
    carToRentId: '6651914a50062bd5ba3ff799',
    emailId: null
  },
  car: {
    id: '6651914a50062bd5ba3ff799',
    insertedDate: '2024-05-25T07:20:42.423Z',
    insertedUser: { name: 'Giuseppe Martellotti' },
    progressive: 7,
    status: { id: 1, name: 'Disponibile' },
    registrationDate: '2024-04-29',
    targa: 'GV976FM',
    price: 80,
    make: 'Audi',
    model: 'A3',
    engine: '1.4 45 TFSI e PHEV',
    makeNormalized: 'Audi',
    trim: 'S Line Edition',
    km: 15320,
    gearboxType: { name: 'Automatico' },
    fuel: { description: 'Elettrica/Benzina' },
    colore: { description: 'Nero' },
    pictureToPublishUrl: 'https://ik.imagekit.io/tuacar/cars/6651914a50062bd5ba3ff799/f5073fbf-e1da-46b2-95fc-0d91c6d2dc95.JPG?tr=n-with_logo_and_space:l-text,i-TuaCar%20Taranto,co-white,ff-common\\BrunoAce-Regular.ttf,fs-25,ly-N25,lx-220,pa-10,l-end:l-text,i-Via%20Lago%20di%20Viverone,%2011%20(TA),co-white,ff-common\\BrunoAce-Regular.ttf,fs-20,ly-N2,lx-220,pa-10,l-end:l-text,i-3281818244,co-white,ff-common\\BrunoAce-Regular.ttf,fs-35,ly-N12,lx-N5,pa-10,l-end',
    pictures: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object]
    ],
    sale: null,
    agenzia: { description: 'TuaCar Taranto' },
    multipubblicazione: { online: false },
    rentDays: [
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object]
    ]
  }
}
*/

export default async function newRent(req: any) {
  const deal = req.deal
  const car = req.car
  const date = req.date
  
  //ADD CAR TO RENT!
  const newCarToRent = {
    contactId: deal?.contactId,
    carToBuyId: 0,
    source: req.action === 'addBreveTermine' ? 'Breve' : 'Lungo',
    agencyCode: deal?.agencyCode,
    userId: deal?.userId,
    erpId: car?.id,
    make: car?.make ? car.make : '',
    model: car?.model ? car.model : '',
    plate: req.action === 'addBreveTermine' ? (car?.targa ?? '') : (car?.plate ?? ''),
    isMessageSent: false,
    rentStatus: "init",
    oldNotes: "",
    isConfirmed: false,
    start: date?.from,
    end: date?.to,
    //bookingId: bookingId,
    //productId: productId,
  };

  const columns = Object.keys(newCarToRent).join(', ');
  const values = Object.values(newCarToRent)
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

  const sqlQuery = `INSERT INTO carsToRent (${columns}) VALUES (${values});`;

  const row: any = await pool.query(sqlQuery);
  const insertId = row[0].insertId;


  //ADD RENT DEAL
  const newDeal = {
    userId: deal?.userId,
    agencyCode: deal?.agencyCode,
    contactId: deal?.contactId,
    stageId: newCarToRent.source === "Breve" ? 16 : 20,
    pipelineId: newCarToRent.source === "Breve" ? 4 : 5,
    title: deal?.title,
    value: deal?.value,
    isAwarded: false,
    isFailed: false,
    carToRentId: insertId,
    oldNotes: "",
  };

  // Create an array of keys and values
  const columnsDeal = Object.keys(newDeal).join(', ');
  const valuesDeal = Object.values(newDeal)
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

  const sqlQueryDeal = `INSERT INTO deals (${columnsDeal}) VALUES (${valuesDeal});`;

  const rowDeal: any = await pool.query(sqlQueryDeal);
  const insertIdDeal = rowDeal[0].insertId;

  //OTTIENI DEAL APPENA CREATO
  const createdDeal = await getBreveById({
    id: insertIdDeal
  })

  return createdDeal
}
