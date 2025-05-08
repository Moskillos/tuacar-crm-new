import { format } from 'date-fns';
import getContactById from '../../contacts/_actions/getContactById';
import { it } from 'date-fns/locale';
import getCarToBuyById from '../../carsToBuy/_actions/getCarToBuyById';
import getCarById from '../../cars/_actions/getCarById';
import getActivityById from '../../calendar/_actions/getActivityById';

export default async function ricordaEvento(activity: any, spokiSettings: any) {
	try {
		//GET ACTIVITY BY ID
		const getActivity = await getActivityById({
			id: activity.id,
		});

		//GET CONTACT DETAILS
		const contact = await getContactById({
			id: activity.contactId,
		});

		let body = null;
		let path = null;

		console.log(spokiSettings)

		if (activity.carToBuyId) {
			//GET CAR TO BUY
			const carToBuy = await getCarToBuyById({
				id: activity.carToBuyId,
			});

			body = {
				secret: spokiSettings.confermaAppuntamentoSecret,
				phone: contact.phoneNumber,
				first_name:
					contact.name && contact.name.length > 0
						? contact.name
						: 'Gentile Cliente',
				last_name: '',
				email: '',
				custom_fields: {
					FIRST_NAME:
						contact.name && contact.name.length > 0
							? contact.name
							: 'Gentile Cliente',
					DATA_APPUNTAMENTO: format(new Date(getActivity.start), 'PP', {
						locale: it,
					}),
					ORARIO: new Date(getActivity.start).toLocaleTimeString('it-IT', {
						hour: '2-digit',
						minute: '2-digit',
						timeZone: 'Europe/Rome',
					}),
					LINK_AUTO:
						carToBuy?.description ? `${carToBuy?.description} ${carToBuy?.url ? carToBuy?.url : ""}` : '',
				},
			};

			path = spokiSettings.confermaAppuntamentoId;
		}

		if (activity.carId) {
			const car = await getCarById({
				id: activity.carId,
			});

			//console.log("car: ", car)

			body = {
				secret: spokiSettings.confermaAppuntamentoVenditaSecret,
				phone: contact.phoneNumber,
				first_name:
					contact.name && contact.name.length > 0
						? contact.name
						: 'Gentile Cliente',
				last_name: '',
				email: '',
				custom_fields: {
					FIRST_NAME:
						contact.name && contact.name.length > 0
							? contact.name
							: 'Gentile Cliente',
					DATA_APPUNTAMENTO: format(new Date(getActivity.start), 'PP', {
						locale: it,
					}),
					ORARIO: new Date(getActivity.start).toLocaleTimeString(
						'it-IT',
						{
							hour: '2-digit',
							minute: '2-digit',
							timeZone: 'Europe/Rome',
						}
					),
					LINK_AUTO:
						car?.make && car?.model ? `${car?.make} ${car?.model} ${car?.url ? car?.url : ""}` : ''
				},
			};

			path = spokiSettings.confermaAppuntamentoVenditaId;
		}

		if (body && path) {
			await fetch(`${path}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});
		}

		return { msg: 'Success' };
	} catch (error) {
		console.log(error);
		return { msg: 'Error' };
	}
}
