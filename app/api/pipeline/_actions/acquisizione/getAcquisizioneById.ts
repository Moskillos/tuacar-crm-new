import pool from '@/lib/db';

export default async function getAcquisizioneById(req: any) {
	// Create an array of keys and values
	const [rows]: any = await pool.query(`
        SELECT deals.*, 
            contacts.name AS contactName, 
            contacts.email AS contactEmail, 
            contacts.phoneNumber AS contactPhoneNumber, 
            contacts.isCommerciant AS contactIsCommerciant,
            contacts.notInterested AS contactNotInterested,
            carsToBuy.*
        FROM deals 
        LEFT JOIN contacts ON deals.contactId = contacts.id 
        LEFT JOIN carsToBuy ON deals.carToBuyId = carsToBuy.id 
        WHERE deals.id = ${req['id']}`);

	let res = rows;
	res[0]['id'] = req['id'];
	res[0]['dealId'] = req['id'];

	return res;
}
