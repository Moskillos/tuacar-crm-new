import pool from '@/lib/db';

export default async function delEmailById(data: any) {
	await pool.query(
		`
        DELETE FROM emailsAds
        WHERE id = ?;`,
		data['id']
	);

	return true;
}
