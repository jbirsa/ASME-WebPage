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
      <CardContent className="p-1 text-center">
        {image ? (
          <img 
            src={image} 
            alt={nombre + ' ' + apellido}
            className="w-20 h-20 rounded-full object-cover mx-auto mb-4" 
          />
        ) : (
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-gray-600" />
          </div>
        )}
        <h3 className="text-lg font-bold text-white">{nombre || "Nombre"}</h3>
        <h3 className="text-lg font-bold mb-2 text-white">{apellido || "Completo"}</h3>
        <p className="text-[#e3a72f] text-sm font-medium mb-6 h-8">{role || "cargo"}</p>

        <div className="flex justify-center space-x-4 ">
          {mail && (
            <a 
              href={`mailto: ${mail}`}
              className="text-[#5f87ab] hover:text-[#e3a72f] transition-colors duration-200"
              aria-label={`Enviar email a ${nombre}`}
              title={mail}
            >
              <Mail className="w-8 h-8" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}