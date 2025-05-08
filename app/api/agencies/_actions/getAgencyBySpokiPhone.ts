import pool from '@/lib/db';

export default async function getAgencyBySpokiPhone(phone: any) {
	const [rows]: any = await pool.query(
		`SELECT 
        agencies.*
    FROM 
        agencies
    WHERE
        agencies.whatsapp LIKE ?`,
		[`%${phone}%`]
	);

	return rows[0];
}
