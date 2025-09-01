

export type Patrocinador = {
    id: number;
    nombre: string;
    email: string;
    link: string;
}

export type Evento = {
    id: number;
    nombre: string;
    tipo: string;
    fecha: Date;   // o string y despues convertir ISOString a Date ????!!?!?!?!
    direccion: string;
    barrio: string;
    provincia: string;
    descripcion: string;
    link: string;
    // imagen: string;      deberia haber un bucket con imagenes
}
