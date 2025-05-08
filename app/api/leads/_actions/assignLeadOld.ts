//NOT CURRENTLY USED
import pool from '@/lib/db';

export default async function assignLead(req: any) {
	const lead = req['lead'];
	const agencyCode = req['agencyCode'];

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
		isMessageSent:
			lead.advertiser_phone && lead.advertiser_phone.length > 0 ? true : false,
		isConfirmed: true,
		geo_region: lead.geo_region,
		geo_provincia: lead.geo_provincia,
		geo_town: lead.geo_town,
	};

	const columnsLead = Object.keys(newLead).join(', ');
	const valuesLead = Object.values(newLead)
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

	const sqlQueryLead = `INSERT INTO carsToBuy (${columnsLead}) VALUES (${valuesLead});`;

	const rowLead: any = await pool.query(sqlQueryLead);
	const insertIdLead = rowLead[0].insertId;

	console.log('new car to buy: ', insertIdLead);

	//RETURN CARS TO BUY
	const [rows]: any = await pool.query(
		`
        SELECT carsToBuy.*,
        contacts.name AS contactName, contacts.email AS contactEmail, contacts.phoneNumber AS contactPhoneNumber, contacts.notInterested AS contactNotInterested, contacts.isConfirmed AS contactIsConfirmed, contacts.isCommerciant AS contactIsCommerciant
        FROM carsToBuy
        JOIN contacts ON carsToBuy.contactId = contacts.id
        WHERE carsToBuy.id = ?
    `,
		[insertIdLead]
	);

	//INVIO SPOKI AUTOMATICO!
	/*
    if (req['sendSpoki']) {
        console.log("SEND SPOKI!!!")
        const spokiSettings = await agencyErpByCode(newLead.agencyCode)
        await sendSpokiPresentazione(newLead, spokiSettings)
    }
    */

	return rows[0];
}
