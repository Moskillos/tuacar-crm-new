import pool from '@/lib/db';

export default async function getEmailById(req: any) {

    const [rows] = await pool.query(`
        SELECT *
        FROM emailsAds 
        WHERE id = ?`, [req.emailId]);

    return { rows };
}
