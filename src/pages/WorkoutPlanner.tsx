import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WorkoutCard } from "@/components/WorkoutCard";
import { getCurrentUser, getWorkouts, createWorkout, updateWorkout, deleteWorkout, Workout } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

const WorkoutPlanner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    loadWorkouts(user.id);
  }, [navigate]);

  const loadWorkouts = async (userId: string) => {
    const userWorkouts = await getWorkouts(userId);
    setWorkouts(userWorkouts);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const workoutData = {
      userId: user.id,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as any,
      duration: parseInt(formData.get("duration") as string),
      date: formData.get("date") as string,
    };

    try {
      if (editingWorkout) {
        await updateWorkout(editingWorkout.id, workoutData);
        toast({
          title: "Workout updated!",
          description: "Your workout has been successfully updated.",
        });
      } else {
        await createWorkout(workoutData);
        toast({
          title: "Workout created!",
          description: "Your new workout has been added to your plan.",
        });
      }

      await loadWorkouts(user.id);
      setIsDialogOpen(false);
      setEditingWorkout(null);
      e.currentTarget.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save workout. Please make sure the backend is running.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWorkout(id);
      const user = getCurrentUser();
      if (user) {
        await loadWorkouts(user.id);
      }
      toast({
        title: "Workout deleted",
        description: "The workout has been removed from your plan.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete workout.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Workout Planner
            </h1>
            <p className="text-muted-foreground">Create and manage your workout routines</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingWorkout(null);
          }}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Add Workout
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingWorkout ? "Edit Workout" : "Create New Workout"}</DialogTitle>
                <DialogDescription>
                  {editingWorkout ? "Update your workout details" : "Add a new workout to your training plan"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Workout Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Morning Run"
                    defaultValue={editingWorkout?.title}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue={editingWorkout?.category || "Cardio"} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardio">Cardio</SelectItem>
                      <SelectItem value="Strength">Strength</SelectItem>
                      <SelectItem value="Yoga">Yoga</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    placeholder="30"
                    defaultValue={editingWorkout?.duration}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    defaultValue={editingWorkout?.date || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your workout routine..."
                    defaultValue={editingWorkout?.description}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingWorkout ? "Update Workout" : "Create Workout"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {workouts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No workouts yet. Create your first workout plan!</p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="w-5 h-5" />
              Add Your First Workout
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlanner;
