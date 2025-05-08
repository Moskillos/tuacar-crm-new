import { getAccessToken } from '@auth0/nextjs-auth0';
import pool from '@/lib/db';

// Fetch function with timeout handling
const fetchWithTimeout = async (url: any, options = {}, timeout = 5000) => {
	const controller = new AbortController();
	const signal = controller.signal;

	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, { ...options, signal });
		clearTimeout(timeoutId); // Clear timeout on success
		return response;
	} catch (error: any) {
		clearTimeout(timeoutId); // Clear timeout on error
		if (error.name === 'AbortError') {
			throw new Error('Request timed out');
		}
		throw error;
	}
};

// Function to fetch agencies with retries and error handling
export async function getAgencies(retries = 3) {
	try {
		// Get the access token
		const accessTokenObj = await getAccessToken({ refresh: true });
		const accessToken = accessTokenObj.accessToken;

		// Define the GraphQL URL and headers
		const url = process.env.GRAPHQL_URL;
		const headers = {
			accept: 'application/json, text/plain, */*',
			'accept-language': 'en-US,en;q=0.9,it;q=0.8',
			authorization: `Bearer ${accessToken}`,
			'content-type': 'application/json',
			'graphql-preflight': '1',
			origin: process.env.AUTH0_AUDIENCE,
			referer: process.env.AUTH0_AUDIENCE,
			'sec-ch-ua':
				'"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"Windows"',
			'sec-fetch-dest': 'empty',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'same-site',
			'user-agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
		};

		// Define the GraphQL query and variables
		const body = JSON.stringify({
			operationName: 'agenzie',
			variables: {
				searchValue: '',
				sortField: 'LastName',
				sortDirection: 'ASCENDING',
			},
			query: `query agenzie($searchValue: String, $sortField: String, $sortDirection: SortDirection) {
        agenzie(
          searchValue: $searchValue
          sortField: $sortField
          sortDirection: $sortDirection
        ) {
          id
          code
          description
          isEnabled
          isVisiblePublic
          denominazione
          indirizzo
          cap
          citta
          provincia
          partitaIva
          codiceFiscale
          email
          sitoWeb
          telefono
          telefonoSpoki
          compensoVoltura
          isFatturazione
          agenziaPrincipale {
            id
            code
            description
          }
          isFranchisor
          spokiConfiguration {
            registrazioneId
            registrazioneSecret
            presentazioneId
            presentazioneSecret
            confermaAppuntamentoId
            confermaAppuntamentoSecret
            confermaAppuntamentoVenditaId
            confermaAppuntamentoVenditaSecret
          }
          regimeFiscale
          regimeDelMargineInitDate
          regimeDelMargineInitValue
          adsAutoscoutMaxNumber
          adsSubitoMaxNumber
          adsAutosupermarketMaxNumber
        }
        agenzieRef: agenzie(sortField: $sortField, sortDirection: $sortDirection) {
          id
          code
          description
          isEnabled
        }
      }`,
		});

		// Make the fetch request with timeout
		const response = await fetchWithTimeout(
			url ? url : '',
			{ method: 'POST', headers, body },
			5000
		); // 10-second timeout

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		return data.data.agenzie;
	} catch (error: any) {
		if (retries > 0) {
			console.log(
				`Retrying... Attempts left: ${retries}, Error: ${error.message}`
			);
			return getAgencies(retries - 1); // Retry the request
		} else {
			console.error('Failed to fetch data after multiple attempts: ', error);
			throw error;
		}
	}
}

export async function synchAgencies(retries = 3) {
	console.log("CALLING SYNCH AGENCIES")
	try {
		// Get the access token
		const accessTokenObj = await getAccessToken({ refresh: true });
		const accessToken = accessTokenObj.accessToken;

		// Define the GraphQL URL and headers
		const url = process.env.GRAPHQL_URL;
		const headers = {
			accept: 'application/json, text/plain, */*',
			'accept-language': 'en-US,en;q=0.9,it;q=0.8',
			authorization: `Bearer ${accessToken}`,
			'content-type': 'application/json',
			'graphql-preflight': '1',
			origin: process.env.AUTH0_AUDIENCE,
			referer: process.env.AUTH0_AUDIENCE,
			'sec-ch-ua':
				'"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"Windows"',
			'sec-fetch-dest': 'empty',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'same-site',
			'user-agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
		};

		// Define the GraphQL query and variables
		const body = JSON.stringify({
			operationName: 'agenzie',
			variables: {
				searchValue: '',
				sortField: 'LastName',
				sortDirection: 'ASCENDING',
			},
			query: `query agenzie($searchValue: String, $sortField: String, $sortDirection: SortDirection) {
        agenzie(
          searchValue: $searchValue
          sortField: $sortField
          sortDirection: $sortDirection
        ) {
          id
          code
          description
          isEnabled
          isVisiblePublic
          denominazione
          indirizzo
          cap
          citta
          provincia
          partitaIva
          codiceFiscale
          email
          sitoWeb
          telefono
          telefonoSpoki
          compensoVoltura
          isFatturazione
          agenziaPrincipale {
            id
            code
            description
          }
          isFranchisor
          spokiConfiguration {
            registrazioneId
            registrazioneSecret
            presentazioneId
            presentazioneSecret
            confermaAppuntamentoId
            confermaAppuntamentoSecret
            confermaAppuntamentoVenditaId
            confermaAppuntamentoVenditaSecret
          }
          regimeFiscale
          regimeDelMargineInitDate
          regimeDelMargineInitValue
          adsAutoscoutMaxNumber
          adsSubitoMaxNumber
          adsAutosupermarketMaxNumber
        }
        agenzieRef: agenzie(sortField: $sortField, sortDirection: $sortDirection) {
          id
          code
          description
          isEnabled
        }
      }`,
		});

		// Make the fetch request with timeout
		const response = await fetchWithTimeout(
			url ? url : '',
			{ method: 'POST', headers, body },
			5000
		); // 10-second timeout

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		//CHECK AND UPDATE DB
		data.data.agenzie.map(async (a: any) => {
			const [rows]: any = await pool.query(
				`SELECT agencies.* FROM agencies WHERE agencies.code = ?`,
				[a.code]
			);
			if (rows.length === 0) {
				/*
				id
				erpId
				cap
				citta
				code
				denominazione
				description
				email
				indirizzo
				provincia
				telefono
				createdAt
				spokiApiKey
				spokiSecretKey
				receiveLeads
				isEnabled
				isPublicView
				whatsapp
		
				{
				id: '65b2292e7060f55b51c36ce5',
				code: 'AGENZIA_013',
				description: 'TuaCar Saluzzo',
				isEnabled: false,
				isVisiblePublic: false,
				denominazione: 'Global Consulting di Cuccu Fabio',
				indirizzo: 'Corso Roma 38',
				cap: '12037',
				citta: 'Saluzzo',
				provincia: 'CN',
				partitaIva: 'IT110355250015',
				codiceFiscale: 'CCCFBA87L26L219Y',
				email: 'info.saluzzo@tua-car.it',
				sitoWeb: 'https://tua-car.it',
				telefono: '3513185204',
				telefonoSpoki: '3513847572',
				compensoVoltura: 100,
				isFatturazione: false,
				agenziaPrincipale: {
					id: '650313d46665ecc646b9c86a',
					code: 'AGENZIA_007',
					description: 'TuaCar Pinerolo'
				},
				isSharedAutoscout: false,
				isFranchisor: null,
				spokiConfiguration: {
					registrazioneId: '',
					registrazioneSecret: '',
					presentazioneId: '',
					presentazioneSecret: '',
					confermaAppuntamentoId: '',
					confermaAppuntamentoSecret: '',
					confermaAppuntamentoVenditaId: '',
					confermaAppuntamentoVenditaSecret: ''
				},
				gestionaleAutoConfiguration: { accessToken: '' },
				regimeFiscale: '',
				regimeDelMargineInitDate: null,
				regimeDelMargineInitValue: 0
				}
				*/

				const newAgency = {
					erpId: a['id'],
					cap: a['cap'],
					citta: a['citta'],
					code: a['code'],
					denominazione: a['denominazione'],
					description: a['description'],
					email: a['email'],
					indirizzo: a['indirizzo'],
					provincia: a['provincia'],
					telefono: a['telefono'],
					//createdAt: '',
					//spokiApiKey: '',
					//spokiSecretKey: '',
					receiveLeads: true,
					isEnabled: a['isEnabled'],
					isPublicView: a['isVisiblePublic'],
					whatsapp: a['telefonoSpoki'],
					parentAgency: a.agenziaPrincipale?.code,
				};

				const columnsAgency = Object.keys(newAgency).join(', ');
				const valuesAgency = Object.values(newAgency)
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

				const sqlQueryAgency = `INSERT INTO agencies (${columnsAgency}) VALUES (${valuesAgency});`;

				await pool.query(sqlQueryAgency);
			} else {
				console.log("AGENCY ALREADY EXIST")

				if (a.agenziaPrincipale) {
					const sqlQueryActivity = `UPDATE agencies SET parentAgency = ?, isEnabled = ?, isPublicView = ?, whatsapp = ?, telefono = ? WHERE erpId = ?`;

					await pool.query(sqlQueryActivity, [a.agenziaPrincipale?.code, a.isEnabled, a.isVisiblePublic, a.telefonoSpoki, a.telefono, a.id]);
				}
			}
		});

		return {
			message: 'Agenzia sincronizzate correttamente'
		}
	} catch (error: any) {
		if (retries > 0) {
			console.log(
				`Retrying... Attempts left: ${retries}, Error: ${error.message}`
			);
			return synchAgencies(retries - 1); // Retry the request
		} else {
			console.error('Failed to fetch data after multiple attempts: ', error);
			throw error;
		}
	}
}

export default async function getAgency(agencyEmail: any) {
	const [rows] = await pool.query(
		`SELECT 
          agencies.*
      FROM 
          agencies
      WHERE agencies.email = ? AND agencies.isEnabled = TRUE`,
		agencyEmail
	);

	return rows;
}

export async function getAgencyByCode(agencyCode: any) {
	const [rows] = await pool.query(
		`SELECT 
          agencies.*
      FROM 
          agencies
      WHERE agencies.code = ? AND agencies.isEnabled = TRUE`,
		agencyCode
	);

	return rows;
}

export async function bloccaRicezione(req: any) {
	await pool.query(
		'UPDATE agencies SET receiveLeads = ? WHERE agencies.code = ?',
		[req['canReceive'], req['agencyCode']]
	);

	return true;
}

export async function getSameGroupAgencies(agencyCode: string) {
	const [rows] = await pool.query(
		`SELECT 
          agencies.*
      FROM 
          agencies
      WHERE agencies.parentAgency = ? OR agencies.code = ?`,
		[agencyCode, agencyCode]
	);

	return rows;
}
