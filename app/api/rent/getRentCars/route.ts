import {NextResponse} from 'next/server';

/*

export async function getRentCarCalendar(erpId: string) {
  const rentCarDeals = await db.query.carsToRent.findMany({
    where: eq(carsToRent.erpId, erpId),
  });

  return rentCarDeals;
}

*/

export const maxDuration = 60; // This function can run for a maximum of 60 seconds
export const dynamic = 'force-dynamic';
import {getAccessToken} from '@auth0/nextjs-auth0';
//import { getRentCarCalendar } from "@/app/_actions/rent";

export async function GET() {
	const accessTokenObj = await getAccessToken({refresh: true});
	const accessToken = accessTokenObj.accessToken;

	const url = process.env.GRAPHQL_URL;
	const headers = {
		accept: 'application/json, text/plain, */*',
		'accept-language': 'en-US,en;q=0.9,it;q=0.8',
		authorization: `Bearer ${accessToken}`,
		'content-type': 'application/json',
		'graphql-preflight': '1',
		origin: 'https://manager.tuacar.it',
		priority: 'u=1, i',
		referer: 'https://manager.tuacar.it/',
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
	const body = JSON.stringify({
		operationName: 'carsRent',
		variables: {
			statusAds: -1,
			progressive: 0,
			searchValue: '',
			status: -1,
			limit: 14,
			offset: 0,
			sortField: 'progressive',
			sortDirection: 'DESCENDING',
		},
		query: `query carsRent($searchValue: String, $statusAds: Int, $progressive: Long, $status: Int, $agenziaCode: String, $limit: Int!, $offset: Int, $sortDirection: SortDirection) {
      carsRent(
        searchValue: $searchValue
        statusAds: $statusAds
        progressive: $progressive
        status: $status
        agenziaCode: $agenziaCode
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
          registrationDate
          targa
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
            url
          }
          sale {
            id
            saleTypeId
          }
          agenzia {
            description
          }
          multipubblicazione {
            online
          }
        }
      }
    }`,
	});

	try {
		const response = await fetch(url ? url : '', {
			method: 'POST',
			headers: headers,
			body: body,
		});
		const data = await response.json();

		const allRentCars: any = [];
		const promises = data.data.carsRent.nodes.map(async (c: any) => {
			const rentDays: any = []; //await getRentCarCalendar(c["id"]);
			const tmp = {...c, rentDays};
			allRentCars.push(tmp);
		});

		// Wait for all promises to resolve
		await Promise.all(promises);

		return NextResponse.json({status: 200, cars: allRentCars});
	} catch (error) {
		console.error('Error:', error);
	}

	return NextResponse.json({status: 200, cars: []});
}
