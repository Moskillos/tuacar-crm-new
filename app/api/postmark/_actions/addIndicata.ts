import * as cheerio from 'cheerio';
import addCarToBuy from '../../emails/_actions/addCarToBuy';
import addContact from '../../contacts/_actions/addContact';

function extractText(htmlString: string) {
	const regex = /<b[^>]*>(.*?)<\/b>/i;
	const match = htmlString.match(regex);

	return match ? match[1] : null;
}

function extractPrice(htmlString: string) {
	const pricePattern = /EUR\s(\d{1,3}(,\d{3})*(\.\d+)?)/;
	const match = htmlString.match(pricePattern);

	if (match) {
		return match[1].replace('.', '');
	} else {
		return null;
	}
}

export default async function addIndicata(data: any, agencyCode: string) {
	// indicata
	if (data.FromFull.Email.includes('indicata.com')) {
		console.log('indicata.com');

		try {
			const $ = cheerio.load(data.HtmlBody);

			const pTags = $('p')
				.toArray()
				.map(element => $.html(element));

			const nome = extractText(pTags[9]);
			const cognome = extractText(pTags[10]);
			const phone = extractText(pTags[11]);
			const email = extractText(pTags[12]);

			let carName: string | null = '';
			let immatricolazione: string | null = '';
			let price: string | null = '';
			let mileage: string | null = '';
			let fuel: string | null = '';

			pTags.map((p, index) => {
				if (p.includes('Chilometraggio')) {
					mileage = extractText(p);
				}
				if (p.includes('Prezzo al dettaglio')) {
					price = extractPrice(pTags[index + 1]);
				}
				if (p.includes('Tipo alimentazione')) {
					fuel = extractText(p);
				}
				if (p.includes('Prima immatricolazione')) {
					immatricolazione = extractText(p);
				}
				if (p.includes('Marca e modello')) {
					carName = extractText(p);
				}
			});

			//const carName = extractText(pTags[24]);
			//const immatricolazione = extractText(pTags[25]);
			//const price = extractPrice(pTags[42]);

			//const mileage = extractText(pTags[35])?.replace(" Km", "").replace(".", "");
			//const fuel = extractText(pTags[30]);

			const notes =
				'Email: ' + email + ' Codice valutazione: ' + extractText(pTags[5]);

			const newData = new Date();
			const date = newData.toISOString();

			const id = Math.floor(Date.now() / 1000);

			//COME GESTIRE LEAD ACQUISIZIONE X AGENZIE DELLO STESSO GRUPPO?

			const newCarToBuy: any = {
				description: carName,
				price: Number(price),
				csvId: id,
				csvUrn: id.toString(),
				url: 'indicata.com',
				agencyCode: agencyCode ? agencyCode : '',
				userId: '1',
				advertiser_name: nome + ' ' + cognome,
				advertiser_phone: phone,
				date_remote: date,
				mileage_scalar: mileage.replace(' Km', '').replace('.', ''),
				register_date: immatricolazione,
				fuel: fuel,
				oldNotes: notes,
				manualSearch: false,
				isMessageSent: false,
			};

			const carToBuy = await addCarToBuy(newCarToBuy);

			console.log('auto aggiunta: ', carToBuy);

			const newContact: any = {
				name: nome && nome.length > 0 ? nome : 'Gentile Cliente',
				phoneNumber: phone,
				userId: '1',
				carsToBuyId: Number(carToBuy),
				label: 'potenziale_fornitore',
				isConfirmed: false,
				agencyCode: agencyCode ? agencyCode : '',
			};
			if (carToBuy) {
				const contactId = await addContact(newContact);
				console.log('contatton aggiunto: ', contactId);
				//if (contactId) await updateContactIdCarAction(Number(carToBuy), Number(contactId));
			}

			return carToBuy;
		} catch (err) {
			console.log('error: ', err);
			return false;
		}
	}

	return true;
}
