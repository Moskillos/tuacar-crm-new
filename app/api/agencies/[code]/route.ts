import { getAgencyByCode } from "@/app/_actions/agencies";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    code: string;
}

export async function GET(req: NextRequest, {params}: { params: Params }) {
    const { code } = params;
    const agency = await getAgencyByCode(code);
    
    return NextResponse.json({ msg: "Success", data: agency }, { status: 200 });
}
