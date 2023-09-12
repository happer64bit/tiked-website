import { NextRequest } from "next/server";
import { TiktokDL } from '@tobyg74/tiktok-api-dl/lib/index';

export async function POST(request: NextRequest) {
    const { URL } = await request.json()

    if(URL) {
        const result = await TiktokDL(URL)
        
        return new Response(JSON.stringify(result));
    }

    return new Response(JSON.stringify({ error: "No video URL provided" }));

}