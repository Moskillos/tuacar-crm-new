import agencyErpByCode from '@/app/_actions/agencyErpByCode';
import pool from '@/lib/db';
import sendSpokiPresentazione from '../../spoki/_actions/sendSpokiPresentazione';

export default async function assignLead(req: any) {
	const lead = req['lead'];

	//INVIO SPOKI
	//if (req['sendSpoki'] && lead.isMessageSent === 0) {
	if (req['sendSpoki'] && !lead.isMessageSent) {
		console.log('SEND SPOKI');
		const spokiSettings = await agencyErpByCode(lead.agencyCode);
		await sendSpokiPresentazione(lead, spokiSettings, 'assignLead');
	}

	//UPDATE LEAD!
	const updateLead: any = {
		userId: req['userId'], //aggiornare l'userID!
		isConfirmed: true,
		isMessageSent:
			req['sendSpoki'] && !lead.isMessageSent ? true : lead.isMessageSent,
	};

	const updateFields = Object.entries(updateLead)
		.map(([key, value]) => {
			if (value === null || value === undefined || value === '') {
				return `${key} = NULL`; // Handle empty, null, or undefined values
			} else if (typeof value === 'string') {
				return `${key} = '${value}'`; // Add single quotes for strings
			} else if (typeof value === 'boolean') {
				return `${key} = ${value ? 1 : 0}`; // Convert boolean to 1/0 for SQL
			} else {
				return `${key} = ${value}`; // Numbers or other types are not quoted
			}
		})
		.join(', ');

	const sqlQueryLead = `UPDATE carsToBuy SET ${updateFields} WHERE carsToBuy.id = ${lead.id};`;

	await pool.query(sqlQueryLead);

	let returnLead = lead;
	returnLead['userId'] = req['userId'];
	returnLead['isConfirmed'] = true;

	return returnLead;
}
