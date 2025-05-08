import pool from '@/lib/db';

export default async function delMultipleLeadsById(data: any) {
	if (!data.ids || !Array.isArray(data.ids) || data.ids.length === 0) {
		throw new Error('Invalid or empty ids array');
	}

	// Create placeholders for the SQL query (?, ?, ?, etc)
	const placeholders = data.ids.map(() => '?').join(',');

	// Execute the query to update multiple records
	await pool.query(
		`UPDATE carsToBuy SET isVisible = FALSE WHERE id IN (${placeholders});`,
		data.ids
	);

	return true;
} 