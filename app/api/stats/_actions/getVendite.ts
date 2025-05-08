import pool from '@/lib/db';

export default async function getAcquisizioni(req: any) {
	const agencyCode = req.agency;
	const startDate = req.startDate;
	const endDate = req.endDate;

	//GET ACQUISIZIONI!
	const [rows]: any[] = await pool.query(
		`SELECT 
            deals.*
        FROM 
            deals
        WHERE deals.agencyCode = ?
            AND deals.pipelineId = 2
            AND deals.createdAt > ? 
            AND deals.createdAt < ?`,
		[agencyCode, startDate, endDate]
	);

	const totali = rows.reduce(
		(acc: any, item: any) => ({
			count: acc.count + 1,
			sumValue: acc.sumValue + (item.value || 0),
		}),
		{count: 0, sumValue: 0}
	);

	const vinte = rows.reduce(
		(acc: any, item: any) => {
			if (item.isAwarded === 1 && typeof item.value === 'number') {
				return {count: acc.count + 1, sumValue: acc.sumValue + item.value};
			}
			return acc;
		},
		{count: 0, sumValue: 0}
	);

	const perse = rows.reduce(
		(acc: any, item: any) => {
			if (item.isFailed === 1 && typeof item.value === 'number') {
				return {count: acc.count + 1, sumValue: acc.sumValue + item.value};
			}
			return acc;
		},
		{count: 0, sumValue: 0}
	);

	const vendite = {
		totali: totali.count,
		vinte: vinte.count,
		perse: perse.count,
		totaliValue: totali.sumValue,
		vinteValue: vinte.sumValue,
		perseValue: perse.sumValue,
	};

	return vendite;
}
