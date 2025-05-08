import { getSellers } from "@/app/_actions/sellers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const req = await request.json();

    if (req['action'] === 'getSellers') {
        const data = await getSellers(req)
        return NextResponse.json({ msg: "Success", data: data }, { status: 200 })
    }
    else {
        return NextResponse.json({ msg: "Success" }, { status: 200 });
    }
}
