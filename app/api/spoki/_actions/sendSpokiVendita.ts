import { it } from 'date-fns/locale';
import { format } from 'date-fns';

/*
spokiConfiguration: {
   registrazioneId: 'wh/ap/62327986-06ae-4607-9fcc-33a5184eb610',
   registrazioneSecret: 'a695e77990774e208acd67e8181f24f3',
   presentazioneId: 'https://app.spoki.it/wh/ap/23272f17-2005-40d2-9931-4a69ff09686e/',
   presentazioneSecret: '49cb6ec65a7a41c99e256afe5af517c6',
   confermaAppuntamentoId: 'https://app.spoki.it/wh/ap/5c8a06b1-8cb3-47db-a6a3-d3af50155799/',
   confermaAppuntamentoSecret: '966be730e02e407b80b0edf1ae86a887',
   confermaAppuntamentoVenditaId: 'https://app.spoki.it/wh/ap/bb3fe2eb-4453-43b2-92e5-aad78323bdd8/',
   confermaAppuntamentoVenditaSecret: '13ed807dd93444d387ff8cd45e72791b'
 },
*/
export default async function setPresentazioneAcquisizione(
	deal: any,
	spokiConfig: any,
	activity: any
) {
	//console.log("DEAL: ", deal)

	//console.log("SPOKI: ", spokiConfig)

	//console.log("ACTIVITY: ", activity)

	//console.log("ACTIVITY: ", activity)

	try {
		const body = {
			secret: spokiConfig.confermaAppuntamentoVenditaSecret || '',
			phone: deal?.contactPhoneNumber || '',
			//phone: '3497943093',
			first_name:
				deal?.contactName && deal?.contactName.length > 0
					? deal.contactName
					: 'Gentile Cliente',
			last_name: '',
			email:
				deal?.contactEmail && deal?.contactEmail.length > 0
					? deal.contactEmail
					: '',
			custom_fields: {
				FIRST_NAME:
					deal?.contactName && deal?.contactName.length > 0
						? deal.contactName
						: 'Gentile Cliente',
				DATA_APPUNTAMENTO: format(new Date(activity.start), 'PP', { locale: it }),
				//ORARIO_APPUNTAMENTO: format(new Date(activity.start), "HH:mm", { locale: it }),
				ORARIO: new Date(activity.start).toLocaleTimeString('it-IT', {
					hour: '2-digit',
					minute: '2-digit',
					timeZone: 'Europe/Rome',
				}),
				//ORARIO_APPUNTAMENTO: "10:00",
				//ORARIO_APPUNTAMENTO: new Date(activity.start).toLocaleTimeString('it-IT'),
				LINK_AUTO:
					deal?.make && deal?.model ? `${deal.make} ${deal.model} ${deal?.url ? deal?.url : ""}` : '',
			},
		};

		if (!body.phone) {
			throw new Error('Missing phone number');
		}

		if (!body.custom_fields.LINK_AUTO) {
			throw new Error('Missing vehicle make and model');
		}

		const res = await fetch(spokiConfig.confermaAppuntamentoVenditaId, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		if (!res.ok) {
			const errorMessage = `Error: ${res.statusText} (Status ${res.status})`;
			console.error(errorMessage);
			return { status: res.status, msg: errorMessage };
		}

		return { status: res.status, msg: 'Success' };
	} catch (error: any) {
		console.error('Request failed:', error.message);
		return { msg: 'Error', details: error.message };
	}
}
