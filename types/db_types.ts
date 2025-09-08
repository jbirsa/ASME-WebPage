export type Patrocinador = {
  id: number;
  nombre: string;
  email: string;
  link: string;
  imagen_url: string;
};

export type Evento = {
  id: number;
  nombre: string;
  tipo: string;
  fecha: Date; // o string y despues convertir ISOString a Date ????!!?!?!?!
  direccion: string;
  barrio: string;
  provincia: string;
  descripcion: string;
  link: string;
  imagen_url: string;
  pagina_evento: string;
};

export type TeamMember = {
  nombre: string;
  apellido: string;
  role: string;
  image?: string;
  mail?: string;
  instagram?: string;
  linkedin?: string;
};

export type TeamCategories = {
  [key: string]: TeamMember[];
};
