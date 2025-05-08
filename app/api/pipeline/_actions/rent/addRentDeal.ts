import pool from '@/lib/db';
import getLungoById from './getLungoById';
import getBreveById from './getBreveById';

export default async function addRentDeal(req: any) {
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

	//OTTIENI DEAL APPENA CREATO
	const createdDeal = req.deal.pipelineId == 5 ? await getLungoById({
		id: insertId
	}) : await getBreveById({
		id: insertId
	})

	return createdDeal
}
