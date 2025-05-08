import pool from '@/lib/db';

export default async function getVenditaById(req: any) {
	// Create an array of keys and values
	const [rows]: any = await pool.query(
		`SELECT deals.*, contacts.name AS contactName, contacts.email AS contactEmail, contacts.phoneNumber AS contactPhoneNumber, cars.* FROM deals JOIN contacts ON deals.contactId = contacts.id JOIN cars ON deals.carId = cars.id WHERE deals.id = ? LIMIT 50;`,
		req['id']
	);

	let res = rows;
	res[0]['id'] = req['id'];
	res[0]['dealId'] = req['id'];

	return res;
}
