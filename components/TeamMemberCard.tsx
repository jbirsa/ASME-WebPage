import { Card, CardContent } from "@/components/ui/card";
import { User, Mail } from "lucide-react";

interface TeamMemberCardProps {
  nombre: string;
  apellido: string;
  role: string;
  mail?: string;
  image?: string;
}

export function TeamMemberCard({ nombre, apellido, role, image, mail }: TeamMemberCardProps) {
  return (
    <Card className="bg-slate-800/70 text-slate-900 border-slate-600 backdrop-blur-sm hover:bg-slate-800/90 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex md:flex-col items-center md:items-center gap-4 md:gap-0">
          <div className="flex-shrink-0">
            {image ? (
              <img 
                src={image} 
                alt={nombre + ' ' + apellido}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover md:mx-auto md:mb-4" 
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-300 rounded-full flex items-center justify-center md:mx-auto md:mb-4">
                <User className="w-8 h-8 md:w-10 md:h-10 text-gray-600" />
              </div>
            )}
          </div>

          <div className="flex-1 text-left md:text-center">
            <h3 className="text-base md:text-lg font-bold text-white">{nombre || "Nombre"}</h3>
            <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2 text-white">{apellido || "Completo"}</h3>
            <p className="text-[#e3a72f] text-xs md:text-sm font-medium mb-2 md:mb-6 md:h-8">{role || "cargo"}</p>

            <div className="flex justify-start md:justify-center space-x-4">
              {mail && (
                <a 
                  href={`mailto:${mail}`}
                  className="text-[#5f87ab] hover:text-[#e3a72f] transition-colors duration-200"
                  aria-label={`Enviar email a ${nombre}`}
                  title={mail}
                >
                  <Mail className="w-6 h-6 md:w-8 md:h-8" />
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}