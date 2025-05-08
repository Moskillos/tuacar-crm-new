//import agencyErpByCode from '@/app/_actions/agencyErpByCode';
import pool from '@/lib/db';
//import sendSpokiPresentazione from '../../spoki/_actions/sendSpokiPresentazione';
import getAgencies from '../../agencies/_actions/getAgencies';

//SALVA I NUOVI LEADS NEL DATABASE!

export default async function autoSaveNewLeads() {
	const agencies = await getAgencies();

	for (const agency of agencies) {
		const { code: agencyCode, email: agencyEmail } = agency;

		try {
			const response = await fetch(`https://api.leads.tua-car.it/leads/lastResult?email=${agencyEmail}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch leads for agency ${agencyEmail}, status: ${response.status}`);
			}

			const leads = await response.json();

			for (const lead of leads) {
				try {
					const findLeadQuery = 'SELECT carsToBuy.* FROM carsToBuy WHERE carsToBuy.csvUrn = ?';
					const [rows]: any = await pool.query(findLeadQuery, [lead.urn]);

					if (rows.length > 0) {
						console.log('LEAD EXISTS');
					} else {
						console.log('NEW LEAD');
						const newContact = {
							name: lead.advertiser_name || 'Gentile Cliente',
							phoneNumber: lead.advertiser_phone,
							userId: '1',
							agencyCode: agencyCode || '',
							label: 'potenziale_fornitore',
							isConfirmed: false,
						};

						const insertIdContact = await insertIntoDB('contacts', newContact);

						const newLead = {
							contactId: insertIdContact,
							csvId: lead.id,
							csvUrn: lead.urn,
							description: lead.subject,
							price: lead.price,
							url: lead.url,
							agencyCode: agencyCode || '',
							userId: '1',
							advertiser_name: lead.advertiser_name,
							advertiser_phone: lead.advertiser_phone,
							advertiser_city: lead.geo_provincia,
							date_remote: lead.date_remote,
							mileage_scalar: lead.mileage_scalar,
							register_date: lead.register_date,
							fuel: lead.fuel,
							manualSearch: false,
							isMessageSent: false,
							isConfirmed: false,
							geo_region: lead.geo_region,
							geo_provincia: lead.geo_provincia,
							geo_town: lead.geo_town,
						};

						const insertIdLead = await insertIntoDB('carsToBuy', newLead);
						console.log('New car to buy:', insertIdLead);
					}
				} catch (error) {
					console.error(`Error querying the database for lead ${lead.urn} on autoSaveNewLeads:`, error);
				}
			}
		} catch (error) {
			console.error(`Error fetching leads for agency ${agencyEmail} on autoSaveNewLeads:`, error);
		}
	}

	async function insertIntoDB(table: any, data: any) {
		const validTables = ['contacts', 'carsToBuy'];
		if (!validTables.includes(table)) {
			throw new Error(`Invalid table: ${table}`);
		}

		const columns = Object.keys(data).join(', ');
		const values = Object.values(data);
		const placeholders = values.map(() => '?').join(', ');

		const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
		const [result]: any = await pool.query(query, values);

		return result.insertId;
	}

	return true;
}
