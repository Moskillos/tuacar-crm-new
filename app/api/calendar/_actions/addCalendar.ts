import agencyErpByCode from '@/app/_actions/agencyErpByCode';
import pool from '@/lib/db';
import sendSpokiAcquisizione from '@/app/api/spoki/_actions/sendSpokiAcquisizione';
import sendSpokiVendita from '@/app/api/spoki/_actions/sendSpokiVendita';

export default async function addCalendar(req: any) {
	if (req['activity'].dealContactId && req['activity'].dealContactId != '') {
		req['activity'].contactId = req['activity'].dealContactId;
	}
	if (req['activity'].dealUserId && req['activity'].dealUserId != '') {
		req['activity'].userId = req['activity'].dealUserId;
	}
	delete req['activity'].id;
	delete req['activity'].dealContactId;
	delete req['activity'].dealUserId;

	//ADD CAR ID -> ASSIGN TO DEAL
	const columnsActivity = Object.keys(req['activity']).join(', ');
	const valuesActivity = Object.values(req['activity']);
	const placeholders = valuesActivity.map(() => '?').join(', ');

	const sqlQueryActivity = `INSERT INTO activities (${columnsActivity}) VALUES (${placeholders});`;

	const rowActivity: any = await pool.query(sqlQueryActivity, valuesActivity);
	const insertIdActivity = rowActivity[0].insertId;

	//GET EVENT AND SEND IT BACK
	const [rows]: any = await pool.query(
		`SELECT 
            activities.*
        FROM 
            activities
        WHERE activities.id = ?`,
		insertIdActivity
	);

	//INVIO ANCHE SPOKI!
	if (req['sendSpoki']) {
		console.log('INVIO ANCHE SPOKI!!!');
		const spokiSettings = await agencyErpByCode(req['agencyCode']);

		if (req['lead']) {
			console.log('IS LEAD!');
			await sendSpokiAcquisizione(req['lead'], spokiSettings, req['activity']);
		}
		if (req['deal']) {
			if (req['deal']['pipelineId'] === 2) {
				console.log('vendita');
				await sendSpokiVendita(req['deal'], spokiSettings, req['activity']);
			}
			if (req['deal']['pipelineId'] === 3) {
				console.log('acquisizione');
				await sendSpokiAcquisizione(
					req['deal'],
					spokiSettings,
					req['activity']
				);
			}
		}
	}

	//IF DEAL VENDITA E STAGE ID = 7 -> SPOSTA DEAL IN APPUNTAMENTO CONFERMATO
	if (
		req['deal'] &&
		req['deal']['stageId'] == 7 &&
		req['deal']['pipelineId'] == 2
	) {
		await pool.query(
			`UPDATE deals SET stageId = 8 WHERE deals.id = ?`,
			req['deal']['dealId']
		);
	}

	//IF LEAD -> CREA ANCHE AFFARE.
	if (req['lead']) {
		const newAcquizione = {
			userId: req['activity']['userId'],
			stageId: 12, //7, 8, 9, 10
			title: req['lead']['description'],
			value: req['lead']['price'],
			oldNotes: '',
			end: '',
			isAwarded: false,
			//createdAt: '',
			contactId: req['activity']['contactId'],
			isFailed: false,
			pipelineId: 3,
			agencyCode: req['activity']['agencyCode'],
			carToBuyId: req['activity']['carToBuyId'],
			carId: null,
			carToRentId: null,
			emailId: null,
		};
		// Create an array of keys and values
		const columns = Object.keys(newAcquizione).join(', ');
		const values = Object.values(newAcquizione);
		const placeholders = values.map(() => '?').join(', ');

		const sqlQuery = `INSERT INTO deals (${columns}) VALUES (${placeholders});`;

		const row: any = await pool.query(sqlQuery, values);
		const insertId = row[0].insertId;

		//UPDATE ATTIVITA' CREATA -> COLLEGA NUOVO DEAL ACQUISIZIONE ID
		await pool.query(
			`UPDATE activities SET dealId = ? WHERE activities.id = ?`,
			[insertId, insertIdActivity]
		);

		await pool.query(
			`UPDATE notes SET dealId = ? WHERE carToBuyId = ?`,
			[insertId, req['activity']['carToBuyId']]
		);

		return insertId;
	}
	return rows[0];
}
