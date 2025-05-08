
import pool from '@/lib/db';

export default async function updateNotificationToken(data: any) {

    let sqlQueryNotificationToken = `
        UPDATE garage 
        SET 
            pushNotificationToken = ?
        WHERE 
`;

    const values = [data.pushNotificationToken];

    if (data.userId) {
        sqlQueryNotificationToken += `garage.userId = ?;`;
        values.push(data.userId);
    } else if (data.contactId) {
        sqlQueryNotificationToken += `garage.contactId = ?;`;
        values.push(data.contactId);
    } else {
        throw new Error('Either userId or contactId must be provided.');
    }

    // Execute the query with the parameterized values
    await pool.query(sqlQueryNotificationToken, values);
}
