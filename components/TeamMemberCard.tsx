import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { ReactNode } from "react";

interface TeamMemberCardProps {
  name: string;
  role: string;
  image?: string;
  socialIcons?: ReactNode;
}

export function TeamMemberCard({ name, role, image, socialIcons }: TeamMemberCardProps) {
  const [firstName, lastName] = name.split(' ', 2);
  
  return (
    <Card className="bg-white text-slate-900 border-0">
      <CardContent className="p-6 text-center">
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-20 h-20 rounded-full object-cover mx-auto mb-4" 
          />
        ) : (
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-gray-600" />
          </div>
        )}
        <h3 className="font-bold text-lg mb-1">{firstName || "Nombre"}</h3>
        <h3 className="font-bold text-lg mb-1">{lastName || "Completo"}</h3>
        <p className="text-gray-600 text-sm mb-4 h-10">{role || "cargo"}</p>
        <div className="flex justify-center space-x-8 ">
          {socialIcons}
        </div>
      </CardContent>
    </Card>
  );
}