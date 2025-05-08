import pool from '@/lib/db';

export default async function getLeads(req: any) {
	const agencyCode = req.agency;
	const startDate = req.startDate;
	const endDate = req.endDate;

	const [carsToBuy]: any = await pool.query(
		`SELECT COUNT(*) AS count
		 FROM carsToBuy
		 WHERE agencyCode = ?
		   AND createdAt > ? 
		   AND createdAt < ?`,
		[agencyCode, startDate, endDate]
	);
	
	const [emailsAds]: any = await pool.query(
		`SELECT COUNT(*) AS count
		 FROM emailsAds
		 WHERE agencyCode = ?
		   AND createdAt > ? 
		   AND createdAt < ?`,
		[agencyCode, startDate, endDate]
	);

	const leads = {
		carsToBuy: carsToBuy[0]?.count || 0,
		emailsAds: emailsAds[0]?.count || 0,
	};

	return leads;
}
