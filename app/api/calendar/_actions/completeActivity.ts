import pool from '@/lib/db';

export default async function completeActivity(req: any) {
	// Assuming there's an id or some condition to identify which row to update
	const sqlQueryActivity = `UPDATE activities SET isComplete = TRUE WHERE activities.id = ${req['activity']['id']};`;

	await pool.query(sqlQueryActivity);

	return true;
}
