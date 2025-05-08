import { getAgencies, synchAgencies } from "@/app/_actions/agencies";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const agencies = await getAgencies();
    return NextResponse.json({ msg: "Success", data: agencies }, { status: 200 });
}

import {
    bloccaRicezione,
} from '@/app/_actions/agencies';
import updateSpokiAgency from './_actions/updateSpokiAgency';
import pool from "@/lib/db";

export async function POST(request: Request) {
    const req = await request.json();

    //SYNCH / GET AGENCIES
    //getAgencies()
    //synchAgencies()

    if (req['action'] === 'updateSpokiAgency') {
        await updateSpokiAgency(req)
        return NextResponse.json({ msg: "Success" }, { status: 200 })
    }
    else if (req['action'] === 'bloccaRicezione') {
        await bloccaRicezione(req)
        return NextResponse.json({ msg: "Success" }, { status: 200 });
    }
    else if (req['action'] === 'getAgencyByCode') {
        const [rows]: any = await pool.query(
            `SELECT 
                agencies.*
            FROM 
                agencies
            WHERE
                agencies.code = ?
            `, req['agencyCode']
        );
        return NextResponse.json({ msg: "Success", data: rows }, { status: 200 });
    }
    else {
        return NextResponse.json({ msg: "Success" }, { status: 200 });
    }
}