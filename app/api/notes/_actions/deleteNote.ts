import pool from '@/lib/db';

export default async function deleteNote(req: any) {
	await pool.query(
		`
        DELETE FROM notes
        WHERE id = ?;`,
		req['id']
	);

	return true;
}
