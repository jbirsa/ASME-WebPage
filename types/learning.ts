export type Clase = {
  claseId: number
  titulo: string
  descripcion?: string | null
  videoUrl?: string | null
  orden?: number | null
}

export type Curso = {
  cursoId: number
  nombre: string
  descripcion?: string | null
  imagenUrl?: string | null
  estado?: string | null
  clases?: Clase[]
}

export type MiCurso = Curso & {
  inscripcion: {
    estado: string
    fechaInscripcion: string
  }
}

export type LoginResponse = {
  access_token: string
}
