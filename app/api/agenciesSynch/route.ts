import { synchAgencies } from "@/app/_actions/agencies";
import { NextResponse } from "next/server";

export async function GET() {
    const res = await synchAgencies();
    return NextResponse.json(res, { status: 200 });
}
