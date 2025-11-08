import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  gradient?: string;
}

export const StatsCard = ({ icon: Icon, label, value, unit, gradient = "from-primary to-accent" }: StatsCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className={`bg-gradient-to-br ${gradient} rounded-lg p-3 w-fit mb-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-3xl font-bold">
            {value}
            {unit && <span className="text-lg ml-1 text-muted-foreground">{unit}</span>}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
