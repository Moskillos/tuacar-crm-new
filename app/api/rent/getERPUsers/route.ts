import { NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';
import { getAccessToken } from '@auth0/nextjs-auth0';

export async function GET() {
    const accessTokenObj = await getAccessToken({ refresh: true });
    const accessToken = accessTokenObj.accessToken;

    const url = process.env.GRAPHQL_URL;
    const headers = {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9,it;q=0.8",
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
        "graphql-preflight": "1",
        origin: "https://manager.tuacar.it",
        priority: "u=1, i",
        referer: "https://manager.tuacar.it/",
        "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    };

    const body = JSON.stringify({
        operationName: "utenti",
        variables: {
            "searchValue": "",
            "limit": 100,
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

    try {
        const response = await fetch(url ? url : "", { method: "POST", headers: headers, body: body });

        const data = await response.json();

        return NextResponse.json({ status: 200, users: data.data.utenti.nodes });
    } catch (err) {
        console.log("err")
    }

    return NextResponse.json({ status: 200, users: [] });
}
