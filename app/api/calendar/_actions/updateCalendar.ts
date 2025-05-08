import pool from '@/lib/db';

export default async function updateCalendar(req: any) {
	const id = req['activity']['id'];

	delete req['activity'].id;

	// Create an array of keys and values for the SET clause
	const updateFields = Object.entries(req['activity'])
		.map(([key, value]) => {
			if (value === null || value === undefined || value === '') {
				return `${key} = NULL`; // Handle empty, null, or undefined values
			} else if (typeof value === 'string') {
				return `${key} = '${value.replace(/'/g, "''")}'`; // Escape single quotes in strings
			} else if (typeof value === 'boolean') {
				return `${key} = ${value ? 1 : 0}`; // Convert boolean to 1/0 for SQL
			} else {
				return `${key} = ${value}`; // Numbers or other types are not quoted
			}
		})
		.join(', ');

	// Assuming there's an id or some condition to identify which row to update
	const sqlQueryActivity = `UPDATE activities SET ${updateFields} WHERE activities.id = ${id};`;

	await pool.query(sqlQueryActivity);

	return true;
}
