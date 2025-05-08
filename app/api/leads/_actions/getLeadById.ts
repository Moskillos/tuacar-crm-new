import pool from '@/lib/db';

export default async function getLeadById(req: any) {
	// Create an array of keys and values
	const [rows]: any = await pool.query(
		`
        SELECT carsToBuy.*,
        contacts.name AS contactName, contacts.email AS contactEmail, contacts.phoneNumber AS contactPhoneNumber, contacts.notInterested AS contactNotInterested, contacts.isConfirmed AS contactIsConfirmed, contacts.isCommerciant AS contactIsCommerciant
        FROM carsToBuy
        JOIN contacts ON carsToBuy.contactId = contacts.id
        WHERE carsToBuy.id = ?
    `,
		req['id']
	);

	//let res = rows
	//res[0]['id'] = req['id']
	//res[0]['dealId'] = req['id']

	return rows[0];
}
