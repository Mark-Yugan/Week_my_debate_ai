
// @ts-nocheck
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const AuthCard = ({ title, description, children }: AuthCardProps) => {
  return (
    <Card className="w-full max-w-md card-neon backdrop-dark border-neon">
      <CardHeader className="text-center">
        {/* Neon Logo */}
        <div className="flex justify-center mb-4">
          <div className="relative group">
            <div className="absolute inset-0 gradient-neon-primary rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <Brain className="h-16 w-16 relative z-10 text-cyan-400" />
          </div>
        </div>
        <CardTitle className="text-2xl font-display text-glow-cyan">{title}</CardTitle>
        <CardDescription className="text-gray-300">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
};

export default AuthCard;
