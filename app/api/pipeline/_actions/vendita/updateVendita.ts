import pool from '@/lib/db';

export default async function updateVendita(req: any) {
	// Create an array of keys and values for the SET clause
	const updateFields = Object.entries(req['deal'])
		.map(([key, value]) => {
			if (value === null || value === undefined || value === '') {
				return `${key} = NULL`; // Handle empty, null, or undefined values
			} else if (typeof value === 'string') {
				return `${key} = '${value}'`; // Add single quotes for strings
			} else if (typeof value === 'boolean') {
				return `${key} = ${value ? 1 : 0}`; // Convert boolean to 1/0 for SQL
			} else {
				return `${key} = ${value}`; // Numbers or other types are not quoted
			}
		})
		.join(', ');

	// Assuming there's an id or some condition to identify which row to update
	const sqlQueryCar = `UPDATE deals SET ${updateFields} WHERE deals.id = ${req['id']};`;

	await pool.query(sqlQueryCar);

	return true;
}
