import { NextRequest } from "next/server";
import { TiktokDL } from '@tobyg74/tiktok-api-dl/lib/index';

export const runtime = "nodejs"

export async function POST(request: NextRequest){
    const { URL } = await request.json()

    request.headers.set("Access-Control-Allow-Origin", "*");
    request.headers.set("Access-Control-Allow-Methods", "GET,POST,HEAD");
    request.headers.set("Access-Control-Allow-Headers", "Content-Type");
  
    if(URL) {
        const result = await TiktokDL(URL).catch((err) => console.error(err))

        return new Response(JSON.stringify(result));
    }

    return new Response(JSON.stringify({ error: "No video URL provided" }));

}