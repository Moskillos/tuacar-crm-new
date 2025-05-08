import * as cheerio from 'cheerio';
import addCarToBuy from '../../emails/_actions/addCarToBuy';
import addContact from '../../contacts/_actions/addContact';
import pool from '@/lib/db';

function extractTextTcm(htmlString: string) {
	const regex = /<p[^>]*>(.*?)<\/p>/i;
	const match = htmlString.match(regex);

	return match ? match[1] : null;
}

export default async function addTCM(data: any, agencyCode: string) {
	//sito tuacar noleggio
	if (data.FromFull.Email.includes('tcm@tuacar.it')) {
		try {
			const $ = cheerio.load(data.HtmlBody);

			const pTags = $('p')
				.toArray()
				.map(element => $.html(element));

			//console.log("pTags: ", pTags)

			let nome: string | undefined = '';
			let phone: string | undefined = '';
			let email: string | undefined = '';
			let make: string | undefined = '';
			let model: string | undefined = '';
			let version: string | undefined = '';
			let immatricolazione: string | undefined = '';
			let mileage: string | undefined = '';
			let commenti: string | undefined = '';

			pTags.map((p, index) => {
				if (p.includes('Nome')) {
					nome = extractTextTcm(p)?.replace('Nome: ', '');
				}
				if (p.includes('Numero di telefono')) {
					phone = extractTextTcm(p)?.replace('Numero di telefono: ', '');
				}
				if (p.includes('Email')) {
					email = extractTextTcm(p)?.replace('Email: ', '');
				}
				if (p.includes('Marca')) {
					make = extractTextTcm(p)?.replace('Marca: ', '');
				}
				if (p.includes('Modello')) {
					model = extractTextTcm(p)?.replace('Modello: ', '');
				}
				if (p.includes('Version')) {
					version = extractTextTcm(p)?.replace('Version: ', '');
				}
				if (p.includes('Data immatricolazione')) {
					immatricolazione = extractTextTcm(p)?.replace(
						'Data immatricolazione: ',
						''
					);
				}
				if (p.includes('Km')) {
					mileage = extractTextTcm(p)?.replace('Km: ', '');
				}
				if (p.includes('Commenti')) {
					commenti = extractTextTcm(p)?.replace('Commenti: ', '');
				}
			});

			try {
				const newData = new Date();
				const date = newData.toISOString();

				const id = Math.floor(Date.now() / 1000);

				//COME GESTIRE LEAD ACQUISIZIONE X AGENZIE DELLO STESSO GRUPPO?

				const newCarToBuy: any = {
					description: make + ' ' + model,
					price: 0,
					csvId: id,
					csvUrn: id.toString(),
					url: 'tcm',
					agencyCode: agencyCode ? agencyCode : '',
					userId: '1',
					advertiser_name: nome,
					advertiser_phone: phone,
					date_remote: date,
					mileage_scalar: mileage.replace(' Km', '').replace('.', ''),
					register_date: immatricolazione,
					//fuel: fuel,
					oldNotes: commenti.replace(/'/g, "''"), // Escape single quotes
					manualSearch: false,
					isMessageSent: false,
					isConfirmed: false,
					isSold: false,
				};
				

				console.log(newCarToBuy);

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
					const contactId = await addContact({
						contact: newContact,
					});
					//console.log("contatto aggiunto: ", contactId)
					//if (contactId) await updateContactIdCarAction(Number(carToBuy), Number(contactId));

					//AGGIORNA ANCHE CONTATTO ID SU CARTOBUY
					await pool.query(
						`
                        UPDATE carsToBuy 
                        SET
                            carsToBuy.contactId = ?
                        WHERE 
                            carsToBuy.id = ?;
                    `,
						[contactId.id, carToBuy]
					);
				}

				return carToBuy;
			} catch (error) {
				console.error('Error:', error);
				return false;
			}
		} catch (error) {
			console.log(error);
			return false;
		}
	}

	return true;
}
