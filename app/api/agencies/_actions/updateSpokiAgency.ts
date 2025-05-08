import pool from '@/lib/db';

export default async function updateSpokiAgency(req: any) {
	const sqlQuery = `UPDATE agencies SET spokiApiKey = ?, spokiSecretKey = ? WHERE agencies.code = ?`;

	// Prepare the values array, including label validation
	const values = [
		req['updateSpokiAgency']['spokiApiKey'],
		req['updateSpokiAgency']['spokiSecretKey'],
		req['agencyCode'],
	];

	// Execute the query with the parameterized values
	await pool.query(sqlQuery, values);

	return true;
}
