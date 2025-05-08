import { getAccessToken } from '@auth0/nextjs-auth0';

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
export async function getSellers(retries = 3) {
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
			operationName: "utenti",
			variables: {
				"searchValue": "",
				"limit": 10,
				"offset": 0
			},
			query: `query utenti($searchValue: String, $limit: Int!, $offset: Int) {
				utenti(searchValue: $searchValue, limit: $limit, offset: $offset) {
					totalCount
					nodes {
					userId
					email
					name
					isBlocked
					roles {
						id
						name
						description
					}
					}
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

		return data.data.utenti.nodes;
	} catch (error: any) {
		if (retries > 0) {
			console.log(
				`Retrying... Attempts left: ${retries}, Error: ${error.message}`
			);
			return getSellers(retries - 1); // Retry the request
		} else {
			console.error('Failed to fetch data after multiple attempts: ', error);
			throw error;
		}
	}
}
