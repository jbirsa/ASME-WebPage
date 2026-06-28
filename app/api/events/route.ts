import { NextResponse, NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseClient";
import { normalizeEvent } from "@/lib/events";


export async function GET(req: NextRequest) {
    try {   
        const supabase = getSupabaseServerClient();
        const { data, error } = await supabase.from('evento').select('*');
        if(error)
            return NextResponse.json( {error: error}, { status: 500 } );
        if(!data)
            return NextResponse.json( { error: 'No data found' }, { status: 404 } );

        const res = await Promise.all(data.map((event) => normalizeEvent(supabase, event)));
        return NextResponse.json({ events: res }, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error){
        return NextResponse.json( {error: error}, { status: 500 } );
    }
}
