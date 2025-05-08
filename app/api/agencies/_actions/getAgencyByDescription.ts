import pool from '@/lib/db';

export default async function getAgencyBySpokiPhone(description: any) {
	const [rows]: any = await pool.query(
		`SELECT 
        agencies.*
    FROM 
        agencies
    WHERE
        agencies.description = ?`,
		[`%${description}%`]
	);

	return rows[0];
}
