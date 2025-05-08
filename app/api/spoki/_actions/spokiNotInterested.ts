import pool from '@/lib/db';

export default async function spokiNotInterested(req: any) {
	try {
		// UPDATE CONTACTS BASED ON PHONE NUMBER
		const sqlUpdateContact = `
			UPDATE contacts
			SET contacts.notInterested = TRUE, contacts.isConfirmed = FALSE
			WHERE contacts.phoneNumber = ?
		`;

		const phoneNumber = req?.data?.from_phone?.replace('+39', '');
		if (!phoneNumber) {
			throw new Error('Phone number is missing or invalid');
		}

		const [result]: any = await pool.query(sqlUpdateContact, [phoneNumber]);

		if (result.affectedRows === 0) {
			return { msg: 'No contacts updated' };
		}

		//UPDATE ALSO CARSTOBUY
		const sqlUpdateCarToBuy: any = `
			UPDATE carsToBuy
			SET carsToBuy.spokiInterested = "NOTINTERESTED"
			WHERE carsToBuy.advertiser_phone = ?
		`;

		await pool.query(sqlUpdateCarToBuy, [phoneNumber]);

		return { msg: 'Success', updatedRows: result.affectedRows };
	} catch (error: any) {
		console.error('Error updating contact:', error);
		return { msg: 'Error', error: error.message };
	}
}
