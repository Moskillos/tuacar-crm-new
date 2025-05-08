import pool from '@/lib/db';

export default async function getEmails(req: any) {
    const offset = req.limit * (req.offset - 1);

    let searchClause = "AND TRUE";

    if (req.search && req.search.trim() !== '') {
        searchClause = `
			AND (
				LOWER(emailsAds.subject) LIKE LOWER(?) OR 
                LOWER(emailsAds.carName) LIKE LOWER(?) OR 
				LOWER(emailsAds.buyerName) LIKE LOWER(?) OR 
				LOWER(emailsAds.buyerEmail) LIKE LOWER(?) OR
				LOWER(emailsAds.buyerPhone) LIKE LOWER(?)
			)
		`;
        searchClause = searchClause.replaceAll('?', "'%" + req.search + "%'")
    }

    const [rows] = await pool.query(`
        SELECT id, agencyCode, url, subject, isAssigned, createdAt, buyerName, 
        buyerPhone, buyerEmail, carName, groupId, mongodbId, emailId, isVisible
        FROM emailsAds 
        WHERE isAssigned = FALSE 
        AND isVisible = TRUE 
        AND agencyCode = ?
        ${searchClause}
        ORDER BY createdAt DESC 
        LIMIT 50
        OFFSET ?
    `, [req.agency, offset]);


    const res: any = await pool.query(`
        SELECT COUNT(*) 
        FROM emailsAds 
        WHERE isAssigned = FALSE 
        AND agencyCode = '${req.agency}' 
        AND isVisible = TRUE
        ${searchClause}
        ;
    `);
    const count = res[0][0]['COUNT(*)'];

    return { rows, count };
}
