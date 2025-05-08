import pool from '@/lib/db';

export default async function removeCarById(data: any) {
	
	await pool.query(
		`
        DELETE FROM garage
        WHERE id = ?;`,
		[data.carId]
	);

	return true;
}
