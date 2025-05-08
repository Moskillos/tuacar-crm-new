import pool from '@/lib/db';

export default async function delLeadById(data: any) {
	await pool.query(
		`UPDATE carsToBuy SET isVisible = FALSE WHERE id = ?;`,
		[data.id]
	);

	return true;
}
