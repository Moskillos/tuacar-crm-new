import pool from '@/lib/db';

export default async function getContactById(req: any) {

    const [rows]: any = await pool.query(
        `SELECT 
            contacts.*
        FROM 
            contacts
        WHERE userId = ?`
        , [req.id]);

    return rows[0];
}
