import pool from '@/lib/db';
import { manageCalendarDates } from './manageCalendarDates';

export default async function addCarToRent(req: any) {

	console.log('ADDDDDDDDDD')
	
	// Create an array of keys and values
	const columns = Object.keys(req['carsToRent']).join(', ');
	const values = Object.values(req['carsToRent'])
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

	return insertId;
}
