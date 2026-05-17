export type CursoArchivo = {
  cursoArchivoId: number
  nombreOriginal: string
  mimeType?: string | null
  size?: number | null
  createdAt?: string | Date | null
  url?: string | null
}

export type ClaseArchivo = {
  claseArchivoId: number
  nombreOriginal: string
  mimeType?: string | null
  size?: number | null
  createdAt?: string | Date | null
  url?: string | null
}

export type Clase = {
  claseId: number
  titulo: string
  descripcion?: string | null
  videoUrl?: string | null
  orden?: number | null
  archivos?: ClaseArchivo[]
}

export type Curso = {
  cursoId: number
  nombre: string
  descripcion?: string | null
  imagenUrl?: string | null
  estado?: string | null
  archivos?: CursoArchivo[]
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
