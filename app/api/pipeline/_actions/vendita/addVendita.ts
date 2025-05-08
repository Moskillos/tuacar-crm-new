import pool from '@/lib/db';

export default async function addVendita(req: any) {
	// Create an array of keys and values
	const columns = Object.keys(req['deal']).join(', ');
	const values = Object.values(req['deal'])
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

	const sqlQuery = `INSERT INTO deals (${columns}) VALUES (${values});`;

	const row: any = await pool.query(sqlQuery);
	const insertId = row[0].insertId;

	//ADD CAR ID
	const addCar = {
		make: req['car']['make'],
		model: req['car']['model'],
		firstRegistrationDate: req['car']['registrationDate'],
		mileage: req['car']['km'],
		powerKw: null,
		powerCv: null,
		fuelType: req['car']['fuel']['description'],
		color: req['car']['colore']['description'],
		//createdAt: '',
		plate: req['car']['targa'],
		insertedDate: req['car']['insertedDate'],
		//description
		userId: req['deal']['userId'],
		contactId: req['deal']['contactId'],
		agencyCode: req['deal']['agencyCode'],
		erpId: req['car']['id'],
		//isConfirmed
		url: '',
	};

	//ADD CAR ID -> ASSIGN TO DEAL
	const columnsCar = Object.keys(addCar).join(', ');
	const valuesCar = Object.values(addCar)
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

	const sqlQueryCar = `INSERT INTO cars (${columnsCar}) VALUES (${valuesCar});`;

	const rowCar: any = await pool.query(sqlQueryCar);
	const insertIdCar = rowCar[0].insertId;

	//UPDATE DEAL CAR ID
	await pool.query(`UPDATE deals SET carId = ? WHERE deals.id = ?`, [
		insertIdCar,
		insertId,
	]);

	return insertId;
}
