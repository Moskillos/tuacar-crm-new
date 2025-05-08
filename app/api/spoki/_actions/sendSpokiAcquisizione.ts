import {it} from 'date-fns/locale';
import {format} from 'date-fns';

/*
DEAL:  {
  id: 114381,
  contactId: 119238,
  agencyCode: 'AGENZIA_003',
  date_remote: '2024-10-02T17:53:09.000Z',
  fuel: 'Gpl',
  mileage_scalar: '81000',
  register_date: '05/2019',
  advertiser_name: 'Alessio',
  advertiser_phone: '3500118672',
  price: 10600,
  url: 'https://www.subito.it/auto/lancia-ypsilon-1-2-gpl-gold-full-optional-torino-572010034.htm',
  userId: '1',
  description: 'Lancia Ypsilon 1.2 GPL Gold full optional',
  isConfirmed: 1,
  manualSearch: 0,
  isMessageSent: 1,
  createdAt: '2024-10-03T19:24:40.000Z',
  oldNotes: null,
  rentStatus: null,
  advertiser_city: 'Torino',
  csvUrn: 'id:ad:583048925:list:572010034',
  csvId: 3694141,
  geo_region: 'Piemonte',
  geo_provincia: 'Torino',
  geo_town: 'Torino',
  contactName: 'Alessio',
  contactEmail: null,
  contactPhoneNumber: '3497943093',
  contactNotInterested: 0,
  contactIsConfirmed: 0,
  contactIsCommerciant: 0
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

 Buongiorno FIRST_NAME confermiamo appuntamento del DATA_APPUNTAMENTO alle ore ORARIO , potrà recarsi presso l’agenzia TUACAR Milano Vai Carlo Espinasse, 83 per la presa visione della sua LINK_AUTO .

*/
export default async function setPresentazioneAcquisizione(
	deal: any,
	spokiConfig: any,
	activity: any
) {
	//console.log("DEAL: ", deal)

	//console.log("SPOKI: ", spokiConfig)

	//console.log("ACTIVITY: ", activity)

	try {
		const body = {
			secret: spokiConfig.confermaAppuntamentoSecret || '',
			//secret: 'a373e0a874c74ec489295f78ebcbb9c4',
			phone: deal?.contactPhoneNumber || '', // Ensure phone is provided
			//phone: '3497943093',
			first_name:
				deal?.contactName && deal?.contactName.length > 0
					? deal.contactName
					: 'Gentile Cliente',
			last_name: '', // Empty field for last name, can be customized
			email:
				deal?.contactEmail && deal?.contactEmail.length > 0
					? deal.contactEmail
					: '', // Provide empty string if no email
			custom_fields: {
				FIRST_NAME:
					deal?.contactName && deal?.contactName.length > 0
						? deal.contactName
						: 'Gentile Cliente',
				DATA_APPUNTAMENTO: format(new Date(activity.start), 'PP', {locale: it}), // Make sure `activity.start` is valid
				//ORARIO: format(new Date(activity.start), "HH:mm", { locale: it }),
				ORARIO: new Date(activity.start).toLocaleTimeString('it-IT', {
					hour: '2-digit',
					minute: '2-digit',
					timeZone: 'Europe/Rome',
				}),
				LINK_AUTO:
					deal?.description ? `${deal?.description} ${deal?.url ? deal?.url : ""}` : '',
			},
		};

		if (!body.phone) {
			throw new Error('Missing phone number');
		}

		const res = await fetch(spokiConfig.confermaAppuntamentoId, {
			//const res = await fetch('https://app.spoki.it/wh/ap/13b3bb1e-92c1-4082-ab8d-e5fb84f0e5c2/', {
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

		return {status: res.status, msg: 'Success'};
	} catch (error: any) {
		console.error('Request failed:', error.message);
		return {msg: 'Error', details: error.message};
	}
}
