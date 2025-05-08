import pool from '@/lib/db';

export default async function deleteContact(req: any) {
	await pool.query(
		`
        DELETE FROM contacts
        WHERE id = ?;`,
		req['id']
	);

	return true;
}
