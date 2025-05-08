import pool from '@/lib/db';

export default async function assignEmail(req: any) {
	// Start the timer
	const startTime = Date.now();
	console.log('Starting email assignment process');

	//CREA NUOVO CONTATTO
	const newContact = {
		name: req['buyerName'],
		phoneNumber: req['buyerPhone'],
		email: req['buyerEmail'],
		userId: req['userId'],
		agencyCode: req['agency'],
		label: 'potenziale_cliente',
		isConfirmed: false,
	};
	console.log(`[${Date.now() - startTime}ms] Contact object created`);

	const query = `INSERT INTO contacts (name, phoneNumber, email, userId, agencyCode, label, isConfirmed) VALUES (?, ?, ?, ?, ?, ?, ?)`;

	const values = [
		newContact.name,
		newContact.phoneNumber,
		newContact.email,
		newContact.userId,
		newContact.agencyCode,
		newContact.label,
		newContact.isConfirmed,
	];

	let contactId = '';
	try {
		console.log(`[${Date.now() - startTime}ms] Starting contact insert query`);
		const result: any = await pool.query(query, values);
		contactId = result[0].insertId;
		console.log(`[${Date.now() - startTime}ms] Contact inserted with ID: ${contactId}`);
	} catch (error) {
		console.error(`[${Date.now() - startTime}ms] Error executing contact query:`, error);
		throw error; // Handle or propagate the error
	}

	//ASSEGNA UN VEICOLO AL LEAD VENDITA E CREA UN NUOVO AFFARE
	const car = req['car'];
	console.log(`[${Date.now() - startTime}ms] Retrieved car data from request`);

	//CREA OBJECT VEICOLO
	const newCar = {
		userId: req['userId'],
		agencyCode: req['agency'],
		contactId: contactId,
		erpId: car?.id ?? '',
		color: car?.colore?.description,
		fuelType: car?.fuel.description,
		make: car?.make,
		model: car?.model,
		plate: car?.targa,
		mileage: car?.km,
		firstRegistrationDate: car?.registrationDate,
		powerCv: car?.ads?.power?.hp,
		powerKw: car?.ads?.power?.kw,
		price: car?.price,
		insertedDate: car?.insertedDate,
		url: req['url'],
	};
	console.log(`[${Date.now() - startTime}ms] Car object created`);

	//ADD CAR ID -> ASSIGN TO DEAL
	const columnsCar = Object.keys(newCar).join(', ');
	const valuesCar = Object.values(newCar)
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
	console.log(`[${Date.now() - startTime}ms] Car SQL values prepared`);

	const sqlQueryCar = `INSERT INTO cars (${columnsCar}) VALUES (${valuesCar});`;
	console.log(`[${Date.now() - startTime}ms] Starting car insert query`);

	const rowCar: any = await pool.query(sqlQueryCar);
	const insertIdCar = rowCar[0].insertId;
	console.log(`[${Date.now() - startTime}ms] Car inserted with ID: ${insertIdCar}`);

	//CREA NUOVO AFFARE
	const newDeal = {
		userId: req['userId'],
		agencyCode: req['agency'],
		contactId: Number(contactId),
		stageId: 7,
		pipelineId: 2,
		title: (car?.make || '') + ' ' + (car?.model || ''),
		value: car?.price ?? 0,
		oldNotes: '',
		emailId: req['emailId'],
		end: '',
		isAwarded: false,
		isFailed: false,
		carToBuyId: null,
		carId: Number(insertIdCar),
		//createdAt: new Date(),
	};
	console.log(`[${Date.now() - startTime}ms] Deal object created`);

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
	console.log(`[${Date.now() - startTime}ms] Deal SQL values prepared`);

	const sqlQueryDeal = `INSERT INTO deals (${columnsDeal}) VALUES (${valuesDeal});`;
	console.log(`[${Date.now() - startTime}ms] Starting deal insert query`);

	const rowDeal: any = await pool.query(sqlQueryDeal);
	const insertIdDeal = rowDeal[0].insertId;
	console.log(`[${Date.now() - startTime}ms] Deal inserted with ID: ${insertIdDeal}`);

	//NASCONDI LEAD VENDITA / EMAIL -> RIMUOVI DALLA LISTA BY GROUPID
	console.log(`[${Date.now() - startTime}ms] Starting email group update query`);
	const sqlQueryEmailGroupId = `UPDATE emailsAds SET isVisible = FALSE, isAssigned = FALSE WHERE emailsAds.groupId = '${req['groupId']}';`;
	await pool.query(sqlQueryEmailGroupId);
	console.log(`[${Date.now() - startTime}ms] Email group updated successfully`);

	console.log(`[${Date.now() - startTime}ms] Starting email update query`);
	const sqlQueryEmailId = `UPDATE emailsAds SET isAssigned = TRUE WHERE emailsAds.id = ${req['emailId']}`;
	await pool.query(sqlQueryEmailId);
	console.log(`[${Date.now() - startTime}ms] Email updated successfully`);

	console.log(`[${Date.now() - startTime}ms] Email assignment process completed`);
	return insertIdDeal;
}
