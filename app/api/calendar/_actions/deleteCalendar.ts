import pool from '@/lib/db';

export default async function deleteCalendar(req: any) {
	await pool.query(
		`
        DELETE FROM activities
        WHERE id = ?;`,
		req['activity']['id']
	);

	return true;
}
