import addContact from "../../contacts/_actions/addContact";
import addNote from "../../notes/_actions/addNote";
import addRentDeal from "../../pipeline/_actions/rent/addRentDeal";

const extractDetails = (text: any) => {
	const details: any = {};

	// Split the input text into lines
	const lines = text.split('<br>');

	// Loop through each line and extract relevant details
	lines.forEach((line: any) => {
		if (line.includes('Nome & Cognome:')) {
			details['Nome & Cognome'] = line.split('Nome & Cognome:')[1].trim();
		} else if (line.includes('Email:')) {
			details['Email'] = line.split('Email:')[1].trim();
		} else if (line.includes('Numero di Telefono:')) {
			details['Numero di Telefono'] = line.split('Numero di Telefono:')[1].trim();
		} else if (line.includes('Seleziona l\'Agenzia di pertinenza:')) {
			details['Agenzia di Pertinenza'] = line.split('Seleziona l\'Agenzia di pertinenza:')[1].trim();
		} else if (line.includes('Messaggio:')) {
			details['Messaggio'] = line.split('Messaggio:')[1].trim();
		} else if (line.includes('URL della Pagina:')) {
			details['URL della Pagina'] = line.split('URL della Pagina:')[1].trim();
		}
	});

	return details;
};


export default async function addTuaCarRent(data: any) {
	//sito tua-car
	const extractedDetails = extractDetails(data.HtmlBody);

	const addNewContact = {
		userId: "1",
		name: extractedDetails['Nome & Cognome'],
		phoneNumber: extractedDetails['Numero di Telefono'],
		email: extractedDetails.Email,
		isConfirmed: true,
		notInterested: false,
		isCommerciant: false,
	};

	const newContact = await addContact({
		contact: addNewContact
	});

	//ADD RENT DEAL
	const newDeal = {
		userId: "1",
		agencyCode: "AGENZIA_001", //AGENZIA MADRE
		contactId: newContact.id ? newContact.id : 0,
		stageId: extractedDetails['URL della Pagina'].includes("breve") ? 16 : 20,
		pipelineId: extractedDetails['URL della Pagina'].includes("breve") ? 4 : 5,
		title: "Richiesta Noleg.",
		value: 0,
		oldNotes: '',
		end: '',
		isAwarded: false,
		isFailed: false,
		carId: null,
		carToRentId: null,
		emailId: null,
	};

	console.log("NEW DEAL: ", newDeal)

	const newRentDeal: any = await addRentDeal({
		deal: newDeal
	});

	const note = {
		userId: null,
		agencyCode: "",
		carToBuyId: null,
		carId: null,
		dealId: newRentDeal[0].dealId,
		carToRentId: null,
		notes: extractedDetails['Messaggio']
	}

	console.log("NOTA: ", note)

	await addNote({
		note: note
	})

	return true;
}
