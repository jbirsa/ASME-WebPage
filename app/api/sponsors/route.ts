import { NextResponse, NextRequest } from "next/server";
import { Patrocinador } from "@/types/db_types";
import { getSupabaseServerClient } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
    
    try {
        const supabase = getSupabaseServerClient();     // veo despues como se llama
        const { data, error } = await supabase.from('patrocinador').select('*');
        if(error) 
            return NextResponse.json({ error: error.message }, { status: 500 });
        if(!data)
            return NextResponse.json({ error: 'No data found' }, { status: 404 });

        const res = data.map((sponsor: Patrocinador) => {  // medio al pedo si la base de datos guarda exactamente asi, pero por las dudas verifica
            return {
                id: sponsor.id,
                name: sponsor.nombre,
                email: sponsor.email,
                link: sponsor.link,
                imagen_url: sponsor.imagen_url,
            }
        });
        return NextResponse.json({ sponsors: res }, { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }

}