import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Trophy } from "lucide-react"
import { Evento } from "@/types/db_types"

export default function Events() {
  return (
    <section id="eventos" className="relative z-10 py-20 px-6 bg-slate-800/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">Próximos Eventos</h2>
          <p className="text-xl text-gray-300">
            No te pierdas nuestras actividades y oportunidades de crecimiento profesional
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          <Card className="bg-slate-800/70 border-slate-600 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#e3a72f] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-[#e3a72f]">Charla: Industria 4.0</h3>
                  <p className="text-gray-300 mb-4">
                    Descubre cómo la automatización y IoT están transformando la manufactura moderna.
                  </p>
                  <div className="text-sm text-[#5f87ab] font-medium">15 de Marzo • 18:00 hs • Aula Magna</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/70 border-slate-600 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#e3a72f] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-[#e3a72f]">Competencia de Diseño</h3>
                  <p className="text-gray-300 mb-4">
                    Participa en el desafío anual de diseño mecánico con premios y reconocimientos.
                  </p>
                  <div className="text-sm text-[#5f87ab] font-medium">22 de Marzo • Todo el día • Laboratorios</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-[#5f87ab] hover:bg-[#145fa2] text-white px-8 py-3">
            Ver Todos los Eventos
          </Button>
        </div>
      </div>
    </section>
  )
}
