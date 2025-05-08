'use server';

import {getAccessToken} from '@auth0/nextjs-auth0';

// Function to fetch with timeout
const fetchWithTimeout = async (url: any, options = {}, timeout = 10000) => {
	const controller = new AbortController();
	const signal = controller.signal;

	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, {...options, signal});
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

export async function getErpCars(search: string, agencyCode: string) {
	try {
		// Get the access token
		const accessTokenObj = await getAccessToken({refresh: true});
		const accessToken = accessTokenObj.accessToken;

		// GraphQL URL
		const url = process.env.GRAPHQL_URL;

		// Request headers
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
		// GraphQL query
		/*
    new variables
    {
       "statusAds": -1,
       "progressive": 0,
       "searchValue": "",
       "status": 1,
       "fromDate": null,
       "toDate": null,
       "limit": 14,
       "offset": 0,
       "sortField": "progressive",
       "sortDirection": "DESCENDING"
     }
    */
		const body = JSON.stringify({
			operationName: 'cars',
			variables: {
				statusAds: -1,
				progressive: 0,
				searchValue: search,
				status: 1,
				fromDate: null,
				toDate: null,
				limit: 9999,
				offset: 0,
				sortField: 'progressive',
				sortDirection: 'DESCENDING',
				agenziaCode: agencyCode,
			},
			query: `query cars($searchValue: String, $statusAds: Int, $progressive: Long, $status: Int, $agenziaCode: String, $fromDate: DateTime, $toDate: DateTime, $caricoTipologia: Int, $onlyMandatoInScadenza: Boolean, $onlyDepositoVeicolo: Boolean, $limit: Int!, $offset: Int, $sortDirection: SortDirection) {
        cars(
          searchValue: $searchValue
          statusAds: $statusAds
          progressive: $progressive
          status: $status
          agenziaCode: $agenziaCode
          fromDate: $fromDate
          toDate: $toDate
          caricoTipologia: $caricoTipologia
          onlyMandatoInScadenza: $onlyMandatoInScadenza
          onlyDepositoVeicolo: $onlyDepositoVeicolo
          limit: $limit
          offset: $offset
          sortDirection: $sortDirection
        ) {
          totalCount
          nodes {
            id
            insertedDate
            insertedUser {
              name
            }
            progressive
            status {
              id
              name
            }
            noteRestituita
            dataRestituzione
            registrationDate
            targa
            caricoTipologia {
              id
              name
            }
            fornitore {
              name
              cellulare
            }
            caricoDocumento {
              caricoDocumentoTipo {
                id
                name
              }
              isDepositoVeicolo
              dataFineMandato
            }
            price
            make
            model
            engine
            makeNormalized
            trim
            km
            gearboxType {
              name
            }
            fuel {
              description
            }
            colore {
              description
            }
            pictureToPublishUrl
            pictures {
              uid
              url
            }
            fornitore {
              cellulare
            }
            spoki {
              sent
              sentDate
            }
            sale {
              id
              saleTypeId
            }
            agenzia {
              id
              description
            }
            carAds {
              forcePublish
              isPublishPending
              web {
                url
                dateLastPublished
                publishError
                externalIdWeb
              }
              autoscout {
                externalId
                url
                isActive
                make {
                  id
                  name
                }
                model {
                  id
                  name
                }
                version
                dateLastPublished
                isPublished
                publishError
              }
              autosupermarket {
                externalId
                url
                isActive
                make {
                  id
                  name
                }
                model {
                  id
                  name
                }
                trim {
                  id
                  name
                }
                dateLastPublished
                isPublished
                publishError
              }
              subito {
                isActive
                make {
                  id
                  name
                }
                model {
                  id
                  name
                }
                version
                dateLastPublished
                isPublished
              }
            }
            multipubblicazione {
              online
            }
          }
        }
      }`,
		});

		// Fetch data with timeout
		const response = await fetchWithTimeout(
			url ? url : '',
			{method: 'POST', headers, body},
			10000
		); // 10-second timeout

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		return data.data.cars.nodes;
	} catch (error: any) {
		console.error('Failed to fetch data after multiple attempts: ', error);
		throw error;
		/*
    if (retries > 0) {
      console.log(`Retrying... Attempts left: ${retries}, Error: ${error.message}`);
      return getErpCars(retries - 1, search); // Retry the request
    } else {
      console.error("Failed to fetch data after multiple attempts: ", error);
      throw error;
    }
      */
	}
}
