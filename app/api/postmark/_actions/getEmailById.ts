import pool from '@/lib/db';

export default async function getEmailById(req: any) {
	console.log("req: ", req)

	const [rows]: any = await pool.query(
		`
        SELECT emailsAds.*
		FROM emailsAds
        WHERE emailsAds.id = ?
    `,
		[req['emailId']]
	);

	return rows[0];
}
