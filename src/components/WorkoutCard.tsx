import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Edit, Trash2, Clock } from "lucide-react";
import { Workout } from "@/lib/storage";

interface WorkoutCardProps {
  workout: Workout;
  onEdit: (workout: Workout) => void;
  onDelete: (id: string) => void;
}

export const WorkoutCard = ({ workout, onEdit, onDelete }: WorkoutCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Cardio':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Strength':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'Yoga':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{workout.title}</CardTitle>
              <Badge variant="outline" className={`mt-1 ${getCategoryColor(workout.category)}`}>
                {workout.category}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(workout)}
              className="h-8 w-8"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(workout.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{workout.description}</p>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">{workout.duration} minutes</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            {new Date(workout.date).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
