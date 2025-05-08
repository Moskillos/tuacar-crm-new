//import { addCarToBuyAction } from "@/app/_actions/carToBuy";
import {getListLeads, getListTowns} from '@/lib/utils';
import addContact from '../../contacts/_actions/addContact';
import sendSpokiPresentazione from '../../spoki/_actions/sendSpokiPresentazione';
import agencyErpByCode from '@/app/_actions/agencyErpByCode';

export async function POST(request: Request) {
	const data = await request.json();

	if (!data) {
		return new Response(JSON.stringify({status: 500, body: 'No data'}));
	}
	if (!data.agency) {
		return new Response(JSON.stringify({status: 500, body: 'No agency'}));
	}

	const towns = await getListTowns(data.agencyEmail);
	const leads: any[] = await getListLeads(data, towns);

	const leadsWithSpoki: (any & any)[] = leads.map(lead => ({
		...lead,
		isMessageSent: false,
	}));

	let leadsNumber = 0;

	for (let index = 0; index < leadsWithSpoki.length; index++) {
		//ADD NEW CAR TO BUY LEAD

		const lead: any = {
			description: leadsWithSpoki[index].subject,
			csvId: leadsWithSpoki[index].csvId,
			csvUrn: leadsWithSpoki[index].csvUrn,
			price: leadsWithSpoki[index].price,
			url: leadsWithSpoki[index].url,
			agencyCode: data.agency.code,
			userId: '1',
			advertiser_name: leadsWithSpoki[index].advertiser_name,
			advertiser_phone: leadsWithSpoki[index].advertiser_phone,
			date_remote: leadsWithSpoki[index].date_remote,
			mileage_scalar: leadsWithSpoki[index].mileage_scalar,
			register_date: leadsWithSpoki[index].register_date,
			fuel: leadsWithSpoki[index].fuel,
			manualSearch: true,
			isMessageSent: false,
		};
		console.log('lead: ', lead);

		//const carToBuy = await addCarToBuyAction(newCarToBuy);
		const newLead = false;

		if (newLead) {
			//SEND SPOKI!
			if (
				data.enableSpoki &&
				leadsWithSpoki[index].advertiser_phone &&
				leadsWithSpoki[index].advertiser_phone.length > 0
			) {
				const spokiSettings = await agencyErpByCode(lead.agencyCode);
				const messageSent = await sendSpokiPresentazione(
					leadsWithSpoki[index],
					spokiSettings,
					'assignLead'
				);
				leadsWithSpoki[index].isMessageSent = messageSent;
			}

			//ADD NEW CONTACT!
			const newContact: any = {
				name:
					leadsWithSpoki[index].advertiser_name &&
					leadsWithSpoki[index].advertiser_name.length > 0
						? leadsWithSpoki[index].advertiser_name
						: 'Gentile Cliente',
				phoneNumber: leadsWithSpoki[index].advertiser_phone,
				userId: '1',
				//carsToBuyId: Number(newLeadId),
				label: 'potenziale_fornitore',
				isConfirmed: false,
			};
			//const contactId = await addContact(newContact);
			//await updateContactIdCarAction(Number(carToBuy), Number(contactId), leadsWithSpoki[index].isMessageSent);
			leadsNumber++;
		}
	}

	if (leadsWithSpoki.length === 0) {
		return new Response(JSON.stringify({status: 200, body: 0}));
	}
	return new Response(JSON.stringify({status: 200, body: leadsNumber}));
}
