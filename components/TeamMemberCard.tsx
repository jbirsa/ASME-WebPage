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
    <Card className="bg-white text-slate-900 border-0">
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
        <h3 className="font-bold text-lg">{nombre || "Nombre"}</h3>
        <h3 className="font-bold text-lg mb-4">{apellido || "Completo"}</h3>
        <p className="text-gray-600 text-sm mb-6 h-8">{role || "cargo"}</p>

        <div className="flex justify-center space-x-4">
          {mail && (
            <a 
              href={`mailto: ${mail}`}
              className="text-gray-700 hover:text-[#e3a72f] transition-colors"
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