import { NextResponse, NextRequest } from "next/server";
import { Evento } from "@/types/db_types";


export async function GET(req: NextRequest) {
    try {   
        const supabase = getSupabaseServerClient();
        const { data, error } = await supabase.from('evento').select('*');
        if(error)
            return NextResponse.json( {error: error}, { status: 500 } );
        if(!data)
            return NextResponse.json( { error: 'No data found' }, { status: 404 } );

        const res = data.map((event: Evento) => {
            return {
                id: event.id,
                name: event.nombre,
                type: event.tipo,
                date: event.fecha,
                location: event.direccion,
                description: event.descripcion,
                link: event.link,
                barrio: event.barrio,
                provincia: event.provincia,
            }
        });
        return NextResponse.json({ events: res }, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error){
        return NextResponse.json( {error: error}, { status: 500 } );
    }
}