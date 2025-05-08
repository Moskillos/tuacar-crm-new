/*
LEAD:  {
    contactId: 119235,
    csvId: 3694296,
    csvUrn: 'id:ad:583051085:list:572015475',
    description: 'Fiat 500x - 2020',
    price: 17200,
    url: 'https://www.subito.it/auto/fiat-500x-2020-torino-572015475.htm',
    agencyCode: 'AGENZIA_003',
    userId: '1',
    advertiser_name: 'Roberto',
    advertiser_phone: null,
    advertiser_city: 'Torino',
    date_remote: '2024-10-02T18:27:31.000Z',
    mileage_scalar: '92000',
    register_date: '01/2020',
    fuel: 'Benzina',
    manualSearch: false,
    isMessageSent: false,
    isConfirmed: true,
    geo_region: 'Piemonte',
    geo_provincia: 'Torino',
    geo_town: 'Torino'
  }
  SPOKI:  {
    registrazioneId: 'wh/ap/62327986-06ae-4607-9fcc-33a5184eb610',
    registrazioneSecret: 'a695e77990774e208acd67e8181f24f3',
    presentazioneId: 'https://app.spoki.it/wh/ap/23272f17-2005-40d2-9931-4a69ff09686e/',
    presentazioneSecret: '49cb6ec65a7a41c99e256afe5af517c6',
    confermaAppuntamentoId: 'https://app.spoki.it/wh/ap/5c8a06b1-8cb3-47db-a6a3-d3af50155799/',
    confermaAppuntamentoSecret: '966be730e02e407b80b0edf1ae86a887',
    confermaAppuntamentoVenditaId: 'https://app.spoki.it/wh/ap/bb3fe2eb-4453-43b2-92e5-aad78323bdd8/',
    confermaAppuntamentoVenditaSecret: '13ed807dd93444d387ff8cd45e72791b'
  }

*/

import pool from '@/lib/db';

export default async function setPresentazioneAcquisizione(
	lead: any,
	spokiConfig: any,
	source: any
) {
	//console.log("LEAD: ", lead)

	//console.log("SPOKI: ", spokiConfig)

	try {
		const body = {
			secret: spokiConfig.presentazioneSecret || '',
			phone:
				source == 'assignLead'
					? lead?.advertiser_phone || ''
					: source == 'leadOrDeal'
						? lead?.contactPhoneNumber || ''
						: '',
			//phone: '3497943093',
			first_name:
				lead?.advertiser_name && lead?.advertiser_name.length > 0
					? lead.advertiser_name
					: 'Gentile Cliente',
			last_name: '',
			email:
				lead?.contactEmail && lead?.contactEmail.length > 0
					? lead.contactEmail
					: '',
			custom_fields: {
				FIRST_NAME:
					lead?.advertiser_name && lead?.advertiser_name.length > 0
						? lead.advertiser_name
						: 'Gentile Cliente',
				LINK_AUTO: lead?.description || '',
			},
		};

		if (!body.phone) {
			throw new Error('Missing phone number');
		}

		const res = await fetch(spokiConfig.presentazioneId, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		if (!res.ok) {
			const errorMessage = `Error: ${res.statusText} (Status ${res.status})`;
			console.error(errorMessage);
			return {status: res.status, msg: errorMessage};
		}

		//SET MESSAGE IS SENT
		//console.log("lead id: ", lead.id)
		const sqlQueryCar = `UPDATE carsToBuy SET isMessageSent = TRUE WHERE carsToBuy.id = ${lead.id};`;
		await pool.query(sqlQueryCar);

		return {status: res.status, msg: 'Success'};
	} catch (error: any) {
		console.error('Request failed:', error.message);
		return {msg: 'Error', details: error.message};
	}
}
