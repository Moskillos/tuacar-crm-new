import agencyErpByCode from '@/app/_actions/agencyErpByCode';
import pool from '@/lib/db';
import sendSpokiPresentazione from '../../spoki/_actions/sendSpokiPresentazione';

//SALVA I NUOVI LEADS NEL DATABASE!

export default async function assignLead(req: any) {
	const agencyCode = req['agencyCode'];

	for (const lead of req['csvLeads']) {
		try {
			// FIND IT FIRST
			const findLead = `SELECT carsToBuy.* FROM carsToBuy WHERE carsToBuy.csvUrn = '${lead.urn}'`;

			// Use await correctly within the loop
			const [rows]: any = await pool.query(findLead);

			// Check if the query returned any result
			if (rows.length > 0) {
				console.log('LEAD EXIST');
			} else {
				console.log('ROW: ', rows[0]);

				console.log('NEW LEAD');
				//ADD CONTACT
				const newContact: any = {
					name:
						lead.advertiser_name && lead.advertiser_name.length > 0
							? lead.advertiser_name
							: 'Gentile Cliente',
					phoneNumber: lead.advertiser_phone,
					userId: '1',
					agencyCode: agencyCode ? agencyCode : '',
					//carsToBuyId: Number(insertIdLead),
					label: 'potenziale_fornitore',
					isConfirmed: false,
				};

				const columnsContact = Object.keys(newContact).join(', ');
				const valuesContact = Object.values(newContact)
					.map(value => {
						if (value === null || value === undefined || value === '') {
							return 'NULL'; // Handle empty, null, or undefined values
						} else if (typeof value === 'string') {
							return `'${value}'`; // Add single quotes for strings
						} else if (typeof value === 'boolean') {
							return value ? 1 : 0; // Convert boolean to 1/0 for SQL
						} else {
							return value; // Numbers or other types are not quoted
						}
					})
					.join(', ');

				const sqlQueryContact = `INSERT INTO contacts (${columnsContact}) VALUES (${valuesContact});`;

				const rowContact: any = await pool.query(sqlQueryContact);
				const insertIdContact = rowContact[0].insertId;

				console.log('NEW CONTACT!: ', insertIdContact);

				//INVIO SPOKI AUTOMATICO!
				let spokiSent = false;
				if (req['sendSpoki'] && lead.advertiser_phone != '') {
					console.log('SEND SPOKI!!!');
					const spokiSettings = await agencyErpByCode(agencyCode);
					await sendSpokiPresentazione(lead, spokiSettings, 'assignLead');

					//SE L'INVIO DELLO SPOKI E' ANDATO A BUON FINE -> AGGIORNARE IS_MESSAGE_SENT
					//use this id: insertIdLead

					spokiSent = true;
				}

				//ADD LEAD
				const newLead: any = {
					contactId: insertIdContact,
					csvId: lead.id,
					csvUrn: lead.urn,
					description: lead.subject,
					price: lead.price,
					url: lead.url,
					agencyCode: agencyCode ? agencyCode : '',
					userId: '1',
					advertiser_name: lead.advertiser_name,
					advertiser_phone: lead.advertiser_phone,
					advertiser_city: lead.geo_provincia,
					date_remote: lead.date_remote,
					mileage_scalar: lead.mileage_scalar,
					register_date: lead.register_date,
					fuel: lead.fuel,
					manualSearch: false,
					//isMessageSent: lead.advertiser_phone && lead.advertiser_phone.length > 0 ? true : false,
					isMessageSent: spokiSent,
					isConfirmed: false,
					geo_region: lead.geo_region,
					geo_provincia: lead.geo_provincia,
					geo_town: lead.geo_town,
				};

				const columnsLead = Object.keys(newLead).join(', ');
				const valuesLead = Object.values(newLead);

				const placeholders = Object.keys(newLead).map(() => '?').join(', ');
				const sqlQueryLead = `INSERT INTO carsToBuy (${columnsLead}) VALUES (${placeholders});`;

				const rowLead: any = await pool.query(sqlQueryLead, valuesLead);
				const insertIdLead = rowLead[0].insertId;

				console.log('new car to buy: ', insertIdLead);
			}
		} catch (error) {
			console.error('Error querying the database for lead on saveNewLeads:', lead, error);
		}
	}
	return true;
}
