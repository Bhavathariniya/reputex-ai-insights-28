
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertTriangle, Shield } from 'lucide-react';

interface CheckItem {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
}

interface SecurityChecksProps {
  checks: CheckItem[];
}

const SecurityChecks: React.FC<SecurityChecksProps> = ({ checks }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pass':
        return 'border-green-500/20 bg-green-500/10';
      case 'fail':
        return 'border-red-500/20 bg-red-500/10';
      case 'warning':
        return 'border-amber-500/20 bg-amber-500/10';
      default:
        return 'border-muted bg-muted/10';
    }
  };

  return (
    <Card className="bg-card/60 backdrop-blur-md border border-white/10">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-neon-cyan" />
          <CardTitle className="text-xl">Security Checks</CardTitle>
        </div>
        <CardDescription>
          Critical security indicators and contract safety
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checks.map((check, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-3 p-3 rounded-md border ${getStatusClass(check.status)}`}
            >
              <div className="mt-0.5">{getStatusIcon(check.status)}</div>
              <div>
                <h4 className="font-medium text-sm">{check.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{check.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityChecks;
