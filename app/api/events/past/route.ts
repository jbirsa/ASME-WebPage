import { NextResponse, NextRequest } from "next/server";
import { Evento } from "@/types/db_types";
import { getSupabaseServerClient } from "@/lib/supabaseClient";


export async function GET(req: NextRequest) {
    try {   
        const supabase = getSupabaseServerClient();
        const { data, error } = await supabase.from('evento').select('*').lt('fecha', new Date().toISOString());
        if(error)
            return NextResponse.json( {error: error}, { status: 500 } );
        if(!data)
            return NextResponse.json( { error: 'No data found' }, { status: 404 } );

        const res = data.map((event: Evento) => {
            return {
                id: event.id,
                nombre: event.nombre,
                tipo: event.tipo,
                fecha: event.fecha,
                direccion: event.direccion,
                barrio: event.barrio,
                provincia: event.provincia,
                descripcion: event.descripcion,
                link: event.link,
                imagen_url: event.imagen_url,
            }
        });
        return NextResponse.json({ events: res }, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error){
        return NextResponse.json( {error: error}, { status: 500 } );
    }
}