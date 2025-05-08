import pool from '@/lib/db';
import getLungoById from './getLungoById';

export default async function assignRent4YouCar(req: any) {
  const deal = req.deal
  const car = req.car

  //ADD CAR TO RENT!
  const newCarToRent = {
    contactId: deal?.contactId,
    carToBuyId: 0,
    source: 'Lungo',
    agencyCode: deal?.agencyCode,
    userId: deal?.userId,
    erpId: car?.id,
    make: car?.make ? car.make : '',
    model: car?.model ? car.model : '',
    plate: car?.plate,
    isMessageSent: false,
    rentStatus: "init",
    oldNotes: "",
    isConfirmed: false,
    //start: date?.from,
    //end: date?.to,
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
  const updateDeal = {
    carToRentId: insertId,
    oldNotes: "",
  };

  // Create an array of keys and values
  const columnsDeal = Object.keys(updateDeal).join(', ');
  const valuesDeal = Object.values(updateDeal)
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
  const createdDeal = await getLungoById({
    id: insertIdDeal
  })

  return createdDeal
}
